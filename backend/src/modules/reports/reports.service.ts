import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from '../../common/entities/sale.entity';
import { Product } from '../../common/entities/product.entity';
import { Expense } from '../../common/entities/expense.entity';
import { SaleItem } from '../../common/entities/sale-item.entity';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Sale) private readonly saleRepo: Repository<Sale>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(Expense) private readonly expenseRepo: Repository<Expense>,
    @InjectRepository(SaleItem) private readonly saleItemRepo: Repository<SaleItem>,
  ) {}

  async sales(from?: string, to?: string) { const qb = this.saleRepo.createQueryBuilder('s').where('s.status = :st', { st: 'completed' }).orderBy('s.sale_date', 'DESC'); if (from) qb.andWhere('DATE(s.sale_date) >= :from', { from }); if (to) qb.andWhere('DATE(s.sale_date) <= :to', { to }); const rows = await qb.getMany(); const total = rows.reduce((s, r) => s + Number(r.totalAmount), 0); return { count: rows.length, total: Number(total.toFixed(2)), items: rows }; }
  async inventory() { const rows = await this.productRepo.find({ order: { name: 'ASC' } }); const totalStockQty = rows.reduce((s, r) => s + r.stockQuantity, 0); const totalStockValue = rows.reduce((s, r) => s + r.stockQuantity * Number(r.costPrice), 0); return { totalStockQty, totalStockValue: Number(totalStockValue.toFixed(2)), items: rows }; }
  async profitLoss(from?: string, to?: string) { const salesQb = this.saleRepo.createQueryBuilder('s').where('s.status = :st', { st: 'completed' }); const expenseQb = this.expenseRepo.createQueryBuilder('e'); const itemQb = this.saleItemRepo.createQueryBuilder('si').innerJoin(Sale, 's', 's.id = si.sale_id').where('s.status = :st', { st: 'completed' }); if (from) { salesQb.andWhere('DATE(s.sale_date) >= :from', { from }); expenseQb.andWhere('e.expense_date >= :from', { from }); itemQb.andWhere('DATE(s.sale_date) >= :from', { from }); } if (to) { salesQb.andWhere('DATE(s.sale_date) <= :to', { to }); expenseQb.andWhere('e.expense_date <= :to', { to }); itemQb.andWhere('DATE(s.sale_date) <= :to', { to }); } const [sales, expenses, items] = await Promise.all([salesQb.getMany(), expenseQb.getMany(), itemQb.getMany()]); const revenue = sales.reduce((s, r) => s + Number(r.totalAmount), 0); const cost = items.reduce((s, i) => s + i.quantity * Number(i.costPrice), 0); const grossProfit = revenue - cost; const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0); const netProfit = grossProfit - totalExpenses; return { revenue: Number(revenue.toFixed(2)), cost: Number(cost.toFixed(2)), grossProfit: Number(grossProfit.toFixed(2)), totalExpenses: Number(totalExpenses.toFixed(2)), netProfit: Number(netProfit.toFixed(2)) }; }
  async expenses(from?: string, to?: string) { const qb = this.expenseRepo.createQueryBuilder('e').orderBy('e.expense_date', 'DESC'); if (from) qb.andWhere('e.expense_date >= :from', { from }); if (to) qb.andWhere('e.expense_date <= :to', { to }); const rows = await qb.getMany(); const total = rows.reduce((s, r) => s + Number(r.amount), 0); return { count: rows.length, total: Number(total.toFixed(2)), items: rows }; }
  async expiry(days = 30) { const rows = await this.productRepo.createQueryBuilder('p').where('p.expiry_date IS NOT NULL').andWhere(`p.expiry_date <= CURRENT_DATE + INTERVAL '${days} days'`).orderBy('p.expiry_date', 'ASC').getMany(); return { days, count: rows.length, items: rows }; }

  private async resolveReport(reportType: string) {
    if (reportType === 'sales') return this.sales();
    if (reportType === 'inventory') return this.inventory();
    if (reportType === 'profit-loss') return this.profitLoss();
    if (reportType === 'expenses') return this.expenses();
    if (reportType === 'expiry') return this.expiry();
    return { message: 'Unsupported report type' };
  }

  private toRows(data: unknown): Record<string, unknown>[] {
    const maybe = data as { items?: unknown };
    if (Array.isArray(maybe.items)) {
      return maybe.items as Record<string, unknown>[];
    }
    return [data as Record<string, unknown>];
  }

  async exportCsv(reportType: string) {
    const data = await this.resolveReport(reportType);
    const json = this.toRows(data);
    if (!json.length) return Buffer.from('');
    const keys = Object.keys(json[0]);
    const lines = [keys.join(',')];
    for (const row of json) lines.push(keys.map((k) => JSON.stringify((row as Record<string, unknown>)[k] ?? '')).join(','));
    return Buffer.from(lines.join('\n'), 'utf-8');
  }

  async exportExcel(reportType: string) {
    const data = await this.resolveReport(reportType);
    const rows = this.toRows(data);
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Report');
    if (rows.length) {
      ws.columns = Object.keys(rows[0]).map((k) => ({ header: k, key: k, width: 20 }));
      rows.forEach((r) => ws.addRow(r));
    }
    return Buffer.from(await wb.xlsx.writeBuffer());
  }

  async exportPdf(reportType: string) {
    const data = await this.resolveReport(reportType);
    const doc = new PDFDocument({ margin: 32 });
    const chunks: Buffer[] = [];
    doc.on('data', (c) => chunks.push(c));
    doc.fontSize(16).text(`Report: ${reportType}`);
    doc.moveDown();
    doc.fontSize(10).text(JSON.stringify(data, null, 2));
    doc.end();
    await new Promise<void>((resolve) => doc.on('end', () => resolve()));
    return Buffer.concat(chunks);
  }
}
