import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from '../../common/entities/owner.entity';
import { Pharmacy } from '../../common/entities/pharmacy.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ActivityLog } from '../../common/entities/activity-log.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Owner) private readonly ownerRepo: Repository<Owner>,
    @InjectRepository(Pharmacy) private readonly pharmacyRepo: Repository<Pharmacy>,
    @InjectRepository(ActivityLog) private readonly logRepo: Repository<ActivityLog>,
    private readonly jwtService: JwtService,
  ) {}

  async ensureDefaultPharmacy(): Promise<Pharmacy> {
    const existing = await this.pharmacyRepo.find({ order: { createdAt: 'ASC' }, take: 1 });
    if (existing[0]) return existing[0];
    return this.pharmacyRepo.save(this.pharmacyRepo.create({ name: 'Jantra Pharmacy', status: 'active' }));
  }

  private async linkOwnerToPharmacy(owner: Owner, pharmacy: Pharmacy) {
    if (!owner.pharmacyId) {
      owner.pharmacyId = pharmacy.id;
      await this.ownerRepo.save(owner);
    }
  }

  private async safeLog(payload: Partial<ActivityLog>) {
    try {
      await this.logRepo.save(this.logRepo.create(payload));
    } catch {
      /* activity log must not block sign-in */
    }
  }

  async ensureOwnerSeeded() {
    const pharmacy = await this.ensureDefaultPharmacy();
    const count = await this.ownerRepo.count();
    if (count > 0) return;
    const passwordHash = await bcrypt.hash(process.env.OWNER_DEFAULT_PASSWORD || 'admin12345', 12);
    await this.ownerRepo.save(
      this.ownerRepo.create({
        pharmacyId: pharmacy.id,
        name: 'Owner',
        email: process.env.OWNER_DEFAULT_EMAIL || 'owner@apexrx.local',
        passwordHash,
        shopName: pharmacy.name,
      }),
    );
  }

  async ensureAdminSeeded() {
    const pharmacy = await this.ensureDefaultPharmacy();
    const email = process.env.ADMIN_EMAIL || 'admin@jantra.local';
    const password = process.env.ADMIN_PASSWORD || 'admin12345';
    const passwordHash = await bcrypt.hash(password, 12);
    const existing = await this.ownerRepo.findOne({ where: { email } });
    if (existing) {
      await this.linkOwnerToPharmacy(existing, pharmacy);
      return;
    }
    await this.ownerRepo.save(
      this.ownerRepo.create({
        pharmacyId: pharmacy.id,
        name: 'Admin',
        email,
        passwordHash,
        shopName: pharmacy.name,
      }),
    );
  }

  private isPlatformAdmin(email: string) {
    const list = (process.env.PLATFORM_ADMIN_EMAILS || 'admin@jantra.local')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    return list.includes(email.toLowerCase());
  }

  async provisionPharmacy(actorEmail: string, dto: { name: string; email: string; password: string; owner_name?: string }) {
    if (!this.isPlatformAdmin(actorEmail)) {
      throw new ForbiddenException('Only platform admin can create pharmacy accounts');
    }
    const email = dto.email.trim().toLowerCase();
    const existing = await this.ownerRepo.findOne({ where: { email } });
    if (existing) throw new ConflictException('An account with this email already exists');

    const pharmacy = await this.pharmacyRepo.save(
      this.pharmacyRepo.create({ name: dto.name.trim(), status: 'active' }),
    );
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const owner = await this.ownerRepo.save(
      this.ownerRepo.create({
        pharmacyId: pharmacy.id,
        name: dto.owner_name?.trim() || dto.name.trim(),
        email,
        passwordHash,
        shopName: pharmacy.name,
      }),
    );

    return {
      pharmacy: { id: pharmacy.id, name: pharmacy.name },
      owner: { id: owner.id, email: owner.email, pharmacy_id: owner.pharmacyId },
    };
  }

  async login(email: string, password: string, ip?: string) {
    await this.ensureOwnerSeeded();
    await this.ensureAdminSeeded();
    const defaultPharmacy = await this.ensureDefaultPharmacy();
    const owner = await this.ownerRepo.findOne({ where: { email } });
    if (!owner) {
      await this.safeLog({
        action: 'FAILED_LOGIN',
        entity: 'owners',
        details: { email },
        ipAddress: ip,
        pharmacyId: defaultPharmacy.id,
      });
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!owner.pharmacyId) {
      await this.linkOwnerToPharmacy(owner, defaultPharmacy);
    }
    const ok = await bcrypt.compare(password, owner.passwordHash);
    if (!ok) {
      await this.safeLog({
        action: 'FAILED_LOGIN',
        entity: 'owners',
        entityId: owner.id,
        details: { email },
        ipAddress: ip,
        pharmacyId: owner.pharmacyId,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync(
      { sub: owner.id, email: owner.email, pharmacyId: owner.pharmacyId },
      { expiresIn: '24h' },
    );
    return {
      token,
      owner: {
        id: owner.id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        shop_name: owner.shopName,
        shop_address: owner.shopAddress,
        avatar_url: owner.avatarUrl,
        pharmacy_id: owner.pharmacyId,
      },
    };
  }

  async profile(ownerId: string) {
    const owner = await this.ownerRepo.findOne({ where: { id: ownerId } });
    if (!owner) return null;
    const { passwordHash: _hash, ...safe } = owner;
    void _hash;
    return safe;
  }

  async changePassword(ownerId: string, currentPassword: string, newPassword: string) {
    const owner = await this.ownerRepo.findOne({ where: { id: ownerId } });
    if (!owner) throw new UnauthorizedException('Unauthorized');
    const ok = await bcrypt.compare(currentPassword, owner.passwordHash);
    if (!ok) throw new UnauthorizedException('Current password is incorrect');
    owner.passwordHash = await bcrypt.hash(newPassword, 12);
    await this.ownerRepo.save(owner);
    return { updated: true };
  }

  async updateProfile(ownerId: string, payload: Partial<Owner>) {
    await this.ownerRepo.update(ownerId, {
      name: payload.name,
      phone: payload.phone,
      shopName: payload.shopName,
      shopAddress: payload.shopAddress,
      avatarUrl: payload.avatarUrl,
    });
    return this.profile(ownerId);
  }
}
