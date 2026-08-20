import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../common/entities/product.entity';
import { TenantContext } from '../../common/tenant/tenant.context';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    private readonly tenant: TenantContext,
  ) {}

  private get pid() {
    return this.tenant.pharmacyId;
  }

  stock() {
    return this.productRepo.find({ where: { pharmacyId: this.pid }, order: { name: 'ASC' } });
  }

  lowStock() {
    return this.productRepo
      .createQueryBuilder('p')
      .where('p.pharmacy_id = :pid', { pid: this.pid })
      .andWhere('p.stock_quantity > 0')
      .andWhere('p.stock_quantity <= p.min_stock_alert')
      .orderBy('p.stock_quantity', 'ASC')
      .getMany();
  }

  outOfStock() {
    return this.productRepo.find({ where: { pharmacyId: this.pid, stockQuantity: 0 }, order: { name: 'ASC' } });
  }
}
