import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from '../../common/entities/owner.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ActivityLog } from '../../common/entities/activity-log.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Owner) private readonly ownerRepo: Repository<Owner>,
    @InjectRepository(ActivityLog) private readonly logRepo: Repository<ActivityLog>,
    private readonly jwtService: JwtService,
  ) {}

  async ensureOwnerSeeded() {
    const count = await this.ownerRepo.count();
    if (count > 0) return;
    const passwordHash = await bcrypt.hash(process.env.OWNER_DEFAULT_PASSWORD || 'admin12345', 12);
    await this.ownerRepo.save(this.ownerRepo.create({
      name: 'Owner',
      email: process.env.OWNER_DEFAULT_EMAIL || 'owner@apexrx.local',
      passwordHash,
      shopName: 'Jantra Pharmacy',
    }));
  }

  async ensureAdminSeeded() {
    const email = process.env.ADMIN_EMAIL || 'admin@jantra.local';
    const password = process.env.ADMIN_PASSWORD || 'admin12345';
    const passwordHash = await bcrypt.hash(password, 12);
    const existing = await this.ownerRepo.findOne({ where: { email } });
    if (existing) return;
    await this.ownerRepo.save(this.ownerRepo.create({
      name: 'Admin',
      email,
      passwordHash,
      shopName: 'Jantra Pharmacy',
    }));
  }

  async login(email: string, password: string, ip?: string) {
    await this.ensureOwnerSeeded();
    await this.ensureAdminSeeded();
    const owner = await this.ownerRepo.findOne({ where: { email } });
    if (!owner) {
      await this.logRepo.save(this.logRepo.create({ action: 'FAILED_LOGIN', entity: 'owners', details: { email }, ipAddress: ip }));
      throw new UnauthorizedException('Invalid credentials');
    }
    const ok = await bcrypt.compare(password, owner.passwordHash);
    if (!ok) {
      await this.logRepo.save(this.logRepo.create({ action: 'FAILED_LOGIN', entity: 'owners', entityId: owner.id, details: { email }, ipAddress: ip }));
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync({ sub: owner.id, email: owner.email }, { expiresIn: '24h' });
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
      },
    };
  }

  async profile(ownerId: string) {
    return this.ownerRepo.findOne({ where: { id: ownerId } });
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
