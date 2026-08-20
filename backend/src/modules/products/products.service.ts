import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../common/entities/product.entity';
import { Category } from '../../common/entities/category.entity';
import { StockMovement } from '../../common/entities/stock-movement.entity';
import { TenantContext } from '../../common/tenant/tenant.context';
import { stripTenantFields } from '../../common/security/sanitize-payload';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productsRepo: Repository<Product>,
    @InjectRepository(Category) private readonly categoriesRepo: Repository<Category>,
    @InjectRepository(StockMovement) private readonly stockRepo: Repository<StockMovement>,
    private readonly tenant: TenantContext,
  ) {}

  private get pid() {
    return this.tenant.pharmacyId;
  }

  async list(page = 1, limit = 20) {
    const [items, total] = await this.productsRepo.findAndCount({
      where: { pharmacyId: this.pid },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(id: string) {
    const row = await this.productsRepo.findOne({ where: { id, pharmacyId: this.pid } });
    if (!row) throw new NotFoundException('Product not found');
    return row;
  }

  categories() {
    return this.categoriesRepo.find({ where: { pharmacyId: this.pid }, order: { name: 'ASC' } });
  }

  findByBarcode(code: string) {
    return this.productsRepo.findOne({ where: { barcode: code, pharmacyId: this.pid } });
  }

  private normalizeUnits(payload: Partial<Product>): Partial<Product> {
    const clean = stripTenantFields(payload as Record<string, unknown>) as Partial<Product>;
    if (clean.unitType === 'bottle') {
      return {
        ...clean,
        unitType: 'bottle',
        piecesPerStrip: 1,
        stripsPerBox: null,
        pharmacyId: this.pid,
      };
    }
    const piecesPerStrip = Math.max(1, Math.floor(Number(clean.piecesPerStrip ?? 1)));
    const stripsPerBoxRaw = clean.stripsPerBox;
    const stripsPerBox =
      stripsPerBoxRaw == null || stripsPerBoxRaw === ('' as unknown)
        ? null
        : Math.max(1, Math.floor(Number(stripsPerBoxRaw)));
    return { ...clean, piecesPerStrip, stripsPerBox, unitType: 'tablet', pharmacyId: this.pid };
  }

  async create(payload: Partial<Product>) {
    const product = this.productsRepo.create(this.normalizeUnits(payload));
    const saved = await this.productsRepo.save(product);
    if ((saved.stockQuantity ?? 0) > 0) {
      await this.stockRepo.save(
        this.stockRepo.create({
          productId: saved.id,
          movementType: 'purchase',
          quantity: saved.stockQuantity,
          note: 'initial stock',
        }),
      );
    }
    return saved;
  }

  async update(id: string, payload: Partial<Product>) {
    await this.get(id);
    await this.productsRepo.update({ id, pharmacyId: this.pid }, this.normalizeUnits(payload));
    return this.get(id);
  }

  async remove(id: string) {
    await this.get(id);
    await this.productsRepo.softDelete({ id, pharmacyId: this.pid });
    return { id, deleted: true };
  }

  async createCategory(payload: Partial<Category>) {
    const category = this.categoriesRepo.create({ ...payload, pharmacyId: this.pid });
    return this.categoriesRepo.save(category);
  }
}
