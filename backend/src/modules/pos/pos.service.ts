import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Product } from '../../common/entities/product.entity';
import { Sale } from '../../common/entities/sale.entity';
import { SaleItem } from '../../common/entities/sale-item.entity';
import { StockMovement } from '../../common/entities/stock-movement.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { isBottleProduct, toPieces, type UnitLevel } from '../../common/utils/unit-conversion';
import PDFDocument from 'pdfkit';
import { DashboardGateway } from '../../common/realtime/dashboard.gateway';
import { TenantContext } from '../../common/tenant/tenant.context';
import { escapeHtml } from '../../common/security/escape-html';

@Injectable()
export class PosService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly notifications: NotificationsService,
    private readonly dashboardGateway: DashboardGateway,
    private readonly tenant: TenantContext,
  ) {}

  private get pid() {
    return this.tenant.pharmacyId;
  }

  private async nextInvoiceNumber(pharmacyId: string): Promise<string> {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const day = `${yyyy}${mm}${dd}`;
    const like = `INV-${day}-%`;
    const rows = await this.dataSource
      .getRepository(Sale)
      .createQueryBuilder('s')
      .where('s.pharmacy_id = :pid', { pid: pharmacyId })
      .andWhere('s.invoice_number LIKE :like', { like })
      .orderBy('s.invoice_number', 'DESC')
      .limit(1)
      .getMany();
    const last = rows[0]?.invoiceNumber;
    const seq = last ? Number(last.split('-')[2]) + 1 : 1;
    return `INV-${day}-${String(seq).padStart(5, '0')}`;
  }

  async createSale(dto: CreateSaleDto) {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const productRepo = qr.manager.getRepository(Product);
      const saleRepo = qr.manager.getRepository(Sale);
      const saleItemRepo = qr.manager.getRepository(SaleItem);
      const movementRepo = qr.manager.getRepository(StockMovement);
      const pharmacyId = this.pid;
      const invoiceNumber = await this.nextInvoiceNumber(pharmacyId);
      let subtotal = 0;
      const staged: Array<{ product: Product; pieces: number; discountPercent: number; lineTotal: number; profit: number }> = [];

      for (const item of dto.items) {
        const product = await productRepo.findOne({ where: { id: item.product_id, pharmacyId } });
        if (!product) throw new UnprocessableEntityException(`Product not found: ${item.product_id}`);
        const unit: UnitLevel = item.unit || (isBottleProduct(product) ? 'bottle' : 'piece');
        let pieces: number;
        try {
          pieces = toPieces(item.quantity, unit, product);
        } catch {
          throw new UnprocessableEntityException(`${product.name}: box unit is not configured`);
        }
        if (product.stockQuantity < pieces) {
          throw new UnprocessableEntityException(`Insufficient stock for ${product.name} (need ${pieces} pieces, have ${product.stockQuantity})`);
        }
        const unitPrice = Number(product.sellingPrice);
        const costPrice = Number(product.costPrice);
        const discountPercent = item.discount_percent || 0;
        const raw = pieces * unitPrice;
        const discounted = raw - raw * (discountPercent / 100);
        const lineTotal = Number(discounted.toFixed(2));
        const profit = Number((lineTotal - pieces * costPrice).toFixed(2));
        subtotal += lineTotal;
        staged.push({ product, pieces, discountPercent, lineTotal, profit });
      }

      const discountAmount = Number((dto.discount_amount || 0).toFixed(2));
      const taxAmount = Number((dto.tax_amount || 0).toFixed(2));
      const totalAmount = Number((subtotal - discountAmount + taxAmount).toFixed(2));
      const sale = await saleRepo.save(
        saleRepo.create({
          pharmacyId,
          invoiceNumber,
          subtotal: subtotal.toFixed(2),
          discountAmount: discountAmount.toFixed(2),
          taxAmount: taxAmount.toFixed(2),
          totalAmount: totalAmount.toFixed(2),
          paymentMethod: dto.payment_method,
          paymentReference: dto.payment_reference,
          status: 'completed',
        }),
      );

      for (const row of staged) {
        await saleItemRepo.save(saleItemRepo.create({ saleId: sale.id, productId: row.product.id, productName: row.product.name, quantity: row.pieces, costPrice: row.product.costPrice, unitPrice: row.product.sellingPrice, discountPercent: row.discountPercent.toFixed(2), lineTotal: row.lineTotal.toFixed(2), profit: row.profit.toFixed(2) }));
        row.product.stockQuantity -= row.pieces;
        await productRepo.save(row.product);
        await movementRepo.save(movementRepo.create({ productId: row.product.id, movementType: 'sale', quantity: -row.pieces, referenceId: sale.id, note: `Sale ${invoiceNumber}` }));
      }

      await qr.commitTransaction();
      for (const row of staged) {
        if (row.product.stockQuantity === 0) {
          await this.notifications.createIfMissingUnread('out_of_stock', row.product.id, `${row.product.name} is now out of stock`, pharmacyId);
        } else if (row.product.stockQuantity <= row.product.minStockAlert) {
          await this.notifications.createIfMissingUnread('low_stock', row.product.id, `${row.product.name} is low on stock (${row.product.stockQuantity})`, pharmacyId);
        }
      }
      this.dashboardGateway.emitDashboardUpdate(pharmacyId, {
        saleId: sale.id,
        invoiceNumber: sale.invoiceNumber,
        totalAmount: sale.totalAmount,
        at: new Date().toISOString(),
      });
      return sale;
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }

  async getInvoiceData(saleId: string) {
    const sale = await this.dataSource.getRepository(Sale).findOne({ where: { id: saleId, pharmacyId: this.pid } });
    if (!sale) throw new NotFoundException('Sale not found');
    const items = await this.dataSource.getRepository(SaleItem).find({ where: { saleId } });
    return { sale, items };
  }

  async getThermalInvoiceHtml(saleId: string) {
    const { sale, items } = await this.getInvoiceData(saleId);
    const inv = escapeHtml(sale.invoiceNumber);
    const lines = items
      .map(
        (i) =>
          `<tr><td>${escapeHtml(i.productName)}</td><td>${i.quantity}</td><td>${Number(i.unitPrice).toFixed(2)}</td><td>${Number(i.lineTotal).toFixed(2)}</td></tr>`,
      )
      .join('');
    return `<!doctype html><html><head><meta charset="utf-8"><title>${inv}</title><style>body{font-family:monospace;width:280px;padding:8px}table{width:100%;font-size:12px}td{padding:2px 0}hr{border:none;border-top:1px dashed #000}</style></head><body><h3 style="margin:0">Jantra Pharmacy</h3><p style="margin:2px 0">${inv}<br/>${escapeHtml(new Date(sale.saleDate).toLocaleString())}</p><hr/><table><tr><td><b>Item</b></td><td><b>Q</b></td><td><b>Rate</b></td><td style="text-align:right"><b>Total</b></td></tr>${lines}</table><hr/><p>Subtotal: ${Number(sale.subtotal).toFixed(2)}<br/>Discount: ${Number(sale.discountAmount).toFixed(2)}<br/>Tax: ${Number(sale.taxAmount).toFixed(2)}<br/><b>Grand Total: ${Number(sale.totalAmount).toFixed(2)}</b></p></body></html>`;
  }

  async getInvoicePdf(saleId: string) {
    const { sale, items } = await this.getInvoiceData(saleId);
    const doc = new PDFDocument({ margin: 32 });
    const chunks: Buffer[] = [];
    doc.on('data', (c) => chunks.push(c));
    doc.fontSize(16).text('Apex Community Pharmacy');
    doc.fontSize(10).text(`Invoice: ${sale.invoiceNumber}`);
    doc.text(`Date: ${new Date(sale.saleDate).toLocaleString()}`);
    doc.moveDown();
    items.forEach((i) => doc.text(`${i.productName}  x${i.quantity}  @${Number(i.unitPrice).toFixed(2)}  = ${Number(i.lineTotal).toFixed(2)}`));
    doc.moveDown();
    doc.text(`Subtotal: ${Number(sale.subtotal).toFixed(2)}`);
    doc.text(`Discount: ${Number(sale.discountAmount).toFixed(2)}`);
    doc.text(`Tax: ${Number(sale.taxAmount).toFixed(2)}`);
    doc.fontSize(12).text(`Total: ${Number(sale.totalAmount).toFixed(2)}`);
    doc.end();
    await new Promise<void>((resolve) => doc.on('end', () => resolve()));
    return Buffer.concat(chunks);
  }
}
