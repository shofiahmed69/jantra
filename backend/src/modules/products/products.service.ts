import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../common/entities/product.entity';
import { Category } from '../../common/entities/category.entity';
import { StockMovement } from '../../common/entities/stock-movement.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productsRepo: Repository<Product>,
    @InjectRepository(Category) private readonly categoriesRepo: Repository<Category>,
    @InjectRepository(StockMovement) private readonly stockRepo: Repository<StockMovement>,
  ) {}

  async list(page = 1, limit = 20) {
    const [items, total] = await this.productsRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
  get(id: string) { return this.productsRepo.findOne({ where: { id } }); }
  categories() { return this.categoriesRepo.find({ order: { name: 'ASC' } }); }
  findByBarcode(code: string) { return this.productsRepo.findOne({ where: { barcode: code } }); }

  async create(payload: Partial<Product>) {
    const product = this.productsRepo.create(payload);
    const saved = await this.productsRepo.save(product);
    if ((saved.stockQuantity ?? 0) > 0) {
      await this.stockRepo.save(this.stockRepo.create({
        productId: saved.id,
        movementType: 'purchase',
        quantity: saved.stockQuantity,
        note: 'initial stock',
      }));
    }
    return saved;
  }

  async update(id: string, payload: Partial<Product>) {
    await this.productsRepo.update(id, payload);
    return this.get(id);
  }

  async remove(id: string) {
    await this.productsRepo.softDelete(id);
    return { id, deleted: true };
  }

  async createCategory(payload: Partial<Category>) {
    const category = this.categoriesRepo.create(payload);
    return this.categoriesRepo.save(category);
  }
}
