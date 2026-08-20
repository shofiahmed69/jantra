import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Purchase } from '../../common/entities/purchase.entity';
import { PurchaseItem } from '../../common/entities/purchase-item.entity';
import { Product } from '../../common/entities/product.entity';
import { StockMovement } from '../../common/entities/stock-movement.entity';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { costPerPiece, isBottleProduct, toPieces, type UnitLevel } from '../../common/utils/unit-conversion';
import { TenantContext } from '../../common/tenant/tenant.context';

@Injectable()
export class PurchasesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Purchase) private readonly purchaseRepo: Repository<Purchase>,
    @InjectRepository(PurchaseItem) private readonly purchaseItemRepo: Repository<PurchaseItem>,
    private readonly tenant: TenantContext,
  ) {}

  private get pid() {
    return this.tenant.pharmacyId;
  }

  async list(page = 1, limit = 20) {
    const [items, total] = await this.purchaseRepo.findAndCount({
      where: { pharmacyId: this.pid },
      order: { purchaseDate: 'DESC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(id: string) {
    const purchase = await this.purchaseRepo.findOne({ where: { id, pharmacyId: this.pid } });
    if (!purchase) throw new NotFoundException('Purchase not found');
    const items = await this.purchaseItemRepo.find({ where: { purchaseId: id } });
    return { ...purchase, items };
  }

  async create(dto: CreatePurchaseDto) {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const productRepo = qr.manager.getRepository(Product);
      const purchaseRepo = qr.manager.getRepository(Purchase);
      const purchaseItemRepo = qr.manager.getRepository(PurchaseItem);
      const movementRepo = qr.manager.getRepository(StockMovement);

      let totalCost = 0;
      const staged: Array<{ product: Product; quantity: number; costPerUnit: number; lineTotal: number; batchNumber?: string; expiryDate?: string }> = [];

      for (const i of dto.items) {
        const pharmacyId = this.pid;
        const product = await productRepo.findOne({ where: { id: i.product_id, pharmacyId } });
        if (!product) throw new NotFoundException(`Product not found: ${i.product_id}`);
        const unit: UnitLevel = (i.unit as UnitLevel) || (isBottleProduct(product) ? 'bottle' : 'piece');
        let piecesAdded: number;
        try {
          piecesAdded = toPieces(i.quantity, unit, product);
        } catch {
          throw new NotFoundException(`${product.name}: box unit is not configured`);
        }
        const lineTotal = Number((i.quantity * i.cost_per_unit).toFixed(2));
        totalCost += lineTotal;
        staged.push({
          product,
          quantity: piecesAdded,
          costPerUnit: costPerPiece(lineTotal, i.quantity, unit, product),
          lineTotal,
          batchNumber: i.batch_number,
          expiryDate: i.expiry_date,
        });
      }

      const purchase = await purchaseRepo.save(purchaseRepo.create({
        pharmacyId: this.pid,
        supplierId: dto.supplier_id,
        purchaseDate: dto.purchase_date,
        invoiceRef: dto.invoice_ref,
        totalCost: totalCost.toFixed(2),
        paymentStatus: dto.payment_status || 'paid',
        amountPaid: Number(dto.amount_paid ?? totalCost).toFixed(2),
        note: dto.note,
      }));

      for (const row of staged) {
        await purchaseItemRepo.save(purchaseItemRepo.create({
          purchaseId: purchase.id,
          productId: row.product.id,
          quantity: row.quantity,
          costPerUnit: Number(row.costPerUnit).toFixed(2),
          batchNumber: row.batchNumber,
          expiryDate: row.expiryDate,
          lineTotal: row.lineTotal.toFixed(2),
        }));

        row.product.stockQuantity += row.quantity;
        row.product.costPrice = Number(row.costPerUnit).toFixed(2);
        if (row.batchNumber) row.product.batchNumber = row.batchNumber;
        if (row.expiryDate) row.product.expiryDate = row.expiryDate;
        await productRepo.save(row.product);

        await movementRepo.save(movementRepo.create({
          productId: row.product.id,
          movementType: 'purchase',
          quantity: row.quantity,
          referenceId: purchase.id,
          note: `Purchase ${purchase.invoiceRef || purchase.id}`,
        }));
      }

      await qr.commitTransaction();
      return purchase;
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  async update(id: string, payload: Partial<Purchase>) {
    await this.purchaseRepo.update({ id, pharmacyId: this.pid }, {
      supplierId: payload.supplierId,
      purchaseDate: payload.purchaseDate,
      invoiceRef: payload.invoiceRef,
      paymentStatus: payload.paymentStatus,
      amountPaid: payload.amountPaid,
      note: payload.note,
    });
    return this.get(id);
  }

  async supplierWise() {
    const rows = await this.purchaseRepo
      .createQueryBuilder('p')
      .where('p.pharmacy_id = :pid', { pid: this.pid })
      .select('p.supplier_id', 'supplierId')
      .addSelect('COUNT(*)', 'purchaseCount')
      .addSelect('COALESCE(SUM(p.total_cost),0)', 'totalCost')
      .groupBy('p.supplier_id')
      .orderBy('totalCost', 'DESC')
      .getRawMany();
    return rows;
  }

  async costSummary(from?: string, to?: string) {
    const qb = this.purchaseRepo
      .createQueryBuilder('p')
      .where('p.pharmacy_id = :pid', { pid: this.pid })
      .select('COALESCE(SUM(p.total_cost),0)', 'totalCost')
      .addSelect('COUNT(*)', 'purchaseCount');
    if (from) qb.andWhere('p.purchase_date >= :from', { from });
    if (to) qb.andWhere('p.purchase_date <= :to', { to });
    const row = await qb.getRawOne<{ totalCost: string; purchaseCount: string }>();
    return { totalCost: Number(row?.totalCost || 0), purchaseCount: Number(row?.purchaseCount || 0) };
  }
}
