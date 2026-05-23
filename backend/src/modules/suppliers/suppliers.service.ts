import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../../common/entities/supplier.entity';
import { Purchase } from '../../common/entities/purchase.entity';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier) private readonly supplierRepo: Repository<Supplier>,
    @InjectRepository(Purchase) private readonly purchaseRepo: Repository<Purchase>,
  ) {}

  async list(page = 1, limit = 20) {
    const [items, total] = await this.supplierRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(id: string) {
    const supplier = await this.supplierRepo.findOne({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  create(payload: Partial<Supplier>) { return this.supplierRepo.save(this.supplierRepo.create(payload)); }

  async update(id: string, payload: Partial<Supplier>) {
    await this.supplierRepo.update(id, payload);
    return this.get(id);
  }

  async remove(id: string) {
    await this.supplierRepo.softDelete(id);
    return { id, deleted: true };
  }

  purchases(id: string) {
    return this.purchaseRepo.find({ where: { supplierId: id }, order: { purchaseDate: 'DESC' } });
  }

  async paymentRecords(id: string) {
    const rows = await this.purchaseRepo.find({ where: { supplierId: id }, order: { purchaseDate: 'DESC' } });
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
