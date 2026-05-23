import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../common/entities/product.entity';

@Injectable()
export class InventoryService {
  constructor(@InjectRepository(Product) private readonly productRepo: Repository<Product>) {}

  stock() { return this.productRepo.find({ order: { name: 'ASC' } }); }
  lowStock() { return this.productRepo.createQueryBuilder('p').where('p.stock_quantity > 0').andWhere('p.stock_quantity <= p.min_stock_alert').orderBy('p.stock_quantity', 'ASC').getMany(); }
  outOfStock() { return this.productRepo.find({ where: { stockQuantity: 0 }, order: { name: 'ASC' } }); }
}
