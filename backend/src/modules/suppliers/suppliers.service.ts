import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../../common/entities/supplier.entity';
import { Purchase } from '../../common/entities/purchase.entity';
import { TenantContext } from '../../common/tenant/tenant.context';
import { pickFields, stripTenantFields } from '../../common/security/sanitize-payload';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier) private readonly supplierRepo: Repository<Supplier>,
    @InjectRepository(Purchase) private readonly purchaseRepo: Repository<Purchase>,
    private readonly tenant: TenantContext,
  ) {}

  private get pid() {
    return this.tenant.pharmacyId;
  }

  async list(page = 1, limit = 20) {
    const [items, total] = await this.supplierRepo.findAndCount({
      where: { pharmacyId: this.pid },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(id: string) {
    const supplier = await this.supplierRepo.findOne({ where: { id, pharmacyId: this.pid } });
    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  private supplierFields(payload: Partial<Supplier>): Partial<Supplier> {
    return pickFields(stripTenantFields(payload as Record<string, unknown>), [
      'name',
      'contactPerson',
      'phone',
      'email',
      'address',
      'note',
    ]) as Partial<Supplier>;
  }

  create(payload: Partial<Supplier>) {
    const safe = this.supplierFields(payload);
    return this.supplierRepo.save(this.supplierRepo.create({ ...safe, pharmacyId: this.pid }));
  }

  async update(id: string, payload: Partial<Supplier>) {
    const safe = this.supplierFields(payload);
    await this.supplierRepo.update({ id, pharmacyId: this.pid }, safe);
    return this.get(id);
  }

  async remove(id: string) {
    await this.get(id);
    await this.supplierRepo.softDelete({ id, pharmacyId: this.pid });
    return { id, deleted: true };
  }

  async purchases(id: string) {
    await this.get(id);
    return this.purchaseRepo.find({
      where: { supplierId: id, pharmacyId: this.pid },
      order: { purchaseDate: 'DESC' },
    });
  }

  async paymentRecords(id: string) {
    await this.get(id);
    const rows = await this.purchaseRepo.find({
      where: { supplierId: id, pharmacyId: this.pid },
      order: { purchaseDate: 'DESC' },
    });
    const totalCost = rows.reduce((s, r) => s + Number(r.totalCost), 0);
    const amountPaid = rows.reduce((s, r) => s + Number(r.amountPaid), 0);
    return {
      supplierId: id,
      purchaseCount: rows.length,
      totalCost: Number(totalCost.toFixed(2)),
      amountPaid: Number(amountPaid.toFixed(2)),
      due: Number((totalCost - amountPaid).toFixed(2)),
      records: rows,
    };
  }
}
