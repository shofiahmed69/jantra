import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from '../../common/entities/sale.entity';
import { SaleItem } from '../../common/entities/sale-item.entity';
import { SaleReturn } from '../../common/entities/sale-return.entity';
import { Product } from '../../common/entities/product.entity';
import { StockMovement } from '../../common/entities/stock-movement.entity';
import { ReturnSaleItemDto } from './dto/return-sale-item.dto';

@Injectable()
export class SalesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Sale) private readonly saleRepo: Repository<Sale>,
    @InjectRepository(SaleItem) private readonly saleItemRepo: Repository<SaleItem>,
    @InjectRepository(SaleReturn) private readonly saleReturnRepo: Repository<SaleReturn>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(StockMovement) private readonly movementRepo: Repository<StockMovement>,
  ) {}

  async list(from?: string, to?: string, status?: string, page = 1, limit = 20) {
    const qb = this.saleRepo.createQueryBuilder('s').orderBy('s.sale_date', 'DESC');
    if (from) qb.andWhere('DATE(s.sale_date) >= :from', { from });
    if (to) qb.andWhere('DATE(s.sale_date) <= :to', { to });
    if (status) qb.andWhere('s.status = :status', { status });
    const [items, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getById(id: string) {
    const sale = await this.saleRepo.findOne({ where: { id } });
    if (!sale) throw new NotFoundException('Sale not found');
    const items = await this.saleItemRepo.find({ where: { saleId: id } });
    const returns = await this.saleReturnRepo.find({ where: { saleId: id } });
    return { ...sale, items, returns };
  }

  async cancelSale(id: string) {
    const sale = await this.saleRepo.findOne({ where: { id } });
    if (!sale) throw new NotFoundException('Sale not found');
    if (sale.status !== 'completed') throw new BadRequestException('Only completed sales can be cancelled');

    const existingReturns = await this.saleReturnRepo.count({ where: { saleId: id } });
    if (existingReturns > 0) throw new BadRequestException('Cannot cancel a sale with returned items');

    const ageMs = Date.now() - new Date(sale.saleDate).getTime();
    const maxHours = Number(process.env.SALE_CANCEL_MAX_HOURS || 24);
    if (ageMs > maxHours * 60 * 60 * 1000) throw new BadRequestException(`Sale older than ${maxHours} hours cannot be cancelled`);

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const items = await qr.manager.getRepository(SaleItem).find({ where: { saleId: id } });
      for (const item of items) {
        const product = await qr.manager.getRepository(Product).findOne({ where: { id: item.productId } });
        if (!product) continue;
        product.stockQuantity += item.quantity;
        await qr.manager.getRepository(Product).save(product);
        await qr.manager.getRepository(StockMovement).save({
          productId: product.id,
          movementType: 'return',
          quantity: item.quantity,
          referenceId: sale.id,
          note: `Sale cancellation ${sale.invoiceNumber}`,
        });
      }

      sale.status = 'cancelled';
      await qr.manager.getRepository(Sale).save(sale);
      await qr.commitTransaction();
      return { id: sale.id, status: sale.status };
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  async returnItem(dto: ReturnSaleItemDto) {
    const sale = await this.saleRepo.findOne({ where: { id: dto.sale_id } });
    if (!sale) throw new NotFoundException('Sale not found');
    if (sale.status !== 'completed') throw new BadRequestException('Only completed sales support returns');

    const item = await this.saleItemRepo.findOne({ where: { id: dto.sale_item_id, saleId: dto.sale_id } });
    if (!item) throw new NotFoundException('Sale item not found');

    const priorReturns = await this.saleReturnRepo.find({ where: { saleId: dto.sale_id, saleItemId: dto.sale_item_id } });
    const alreadyReturned = priorReturns.reduce((s, r) => s + r.quantityReturned, 0);
    const maxReturnable = item.quantity - alreadyReturned;
    if (dto.quantity_returned > maxReturnable) throw new BadRequestException('Return quantity exceeds allowed limit');

    const unitPrice = Number(item.unitPrice);
    const refundAmount = Number((dto.quantity_returned * unitPrice).toFixed(2));

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const row = await qr.manager.getRepository(SaleReturn).save({
        saleId: dto.sale_id,
        saleItemId: dto.sale_item_id,
        quantityReturned: dto.quantity_returned,
        refundAmount: refundAmount.toFixed(2),
        reason: dto.reason,
        restock: dto.restock,
      });

      if (dto.restock) {
        const product = await qr.manager.getRepository(Product).findOne({ where: { id: item.productId } });
        if (product) {
          product.stockQuantity += dto.quantity_returned;
          await qr.manager.getRepository(Product).save(product);
          await qr.manager.getRepository(StockMovement).save({
            productId: product.id,
            movementType: 'return',
            quantity: dto.quantity_returned,
            referenceId: dto.sale_id,
            note: `Sale return ${sale.invoiceNumber}`,
          });
        }
      }

      await qr.commitTransaction();
      return row;
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  async daily(date?: string) {
    const d = date || new Date().toISOString().slice(0, 10);
    const rows = await this.saleRepo.createQueryBuilder('s').where('DATE(s.sale_date) = :d', { d }).andWhere('s.status = :st', { st: 'completed' }).getMany();
    return this.aggregateSales(rows, `daily:${d}`);
  }

  async weekly() {
    const rows = await this.saleRepo.createQueryBuilder('s').where("s.sale_date >= NOW() - INTERVAL '7 days'").andWhere('s.status = :st', { st: 'completed' }).getMany();
    return this.aggregateSales(rows, 'weekly');
  }

  async monthly() {
    const rows = await this.saleRepo.createQueryBuilder('s').where("DATE_TRUNC('month', s.sale_date) = DATE_TRUNC('month', NOW())").andWhere('s.status = :st', { st: 'completed' }).getMany();
    return this.aggregateSales(rows, 'monthly');
  }

  async yearly() {
    const rows = await this.saleRepo.createQueryBuilder('s').where("DATE_TRUNC('year', s.sale_date) = DATE_TRUNC('year', NOW())").andWhere('s.status = :st', { st: 'completed' }).getMany();
    return this.aggregateSales(rows, 'yearly');
  }

  async hourly(date?: string) {
    const d = date || new Date().toISOString().slice(0, 10);
    const rows = await this.saleRepo
      .createQueryBuilder('s')
      .select("TO_CHAR(s.sale_date, 'HH24')", 'hour')
      .addSelect('COUNT(*)', 'count')
      .addSelect('COALESCE(SUM(s.total_amount),0)', 'total')
      .where('DATE(s.sale_date) = :d', { d })
      .andWhere('s.status = :st', { st: 'completed' })
      .groupBy('hour')
      .orderBy('hour', 'ASC')
      .getRawMany();
    return rows;
  }

  async productWise(from?: string, to?: string) {
    const qb = this.saleItemRepo.createQueryBuilder('si')
      .innerJoin(Sale, 's', 's.id = si.sale_id')
      .select('si.product_id', 'productId')
      .addSelect('si.product_name', 'productName')
      .addSelect('SUM(si.quantity)', 'quantity')
      .addSelect('COALESCE(SUM(si.line_total),0)', 'revenue')
      .where('s.status = :st', { st: 'completed' })
      .groupBy('si.product_id')
      .addGroupBy('si.product_name')
      .orderBy('revenue', 'DESC');

    if (from) qb.andWhere('DATE(s.sale_date) >= :from', { from });
    if (to) qb.andWhere('DATE(s.sale_date) <= :to', { to });
    return qb.getRawMany();
  }

  private aggregateSales(rows: Sale[], label: string) {
    const totalSales = rows.reduce((s, r) => s + Number(r.totalAmount), 0);
    return { label, transactionCount: rows.length, totalSales: Number(totalSales.toFixed(2)) };
  }
}
