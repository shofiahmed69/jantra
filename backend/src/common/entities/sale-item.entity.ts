import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sale_items')
export class SaleItem {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'sale_id', type: 'uuid' }) saleId: string;
  @Column({ name: 'product_id', type: 'uuid' }) productId: string;
  @Column({ name: 'product_name', length: 150 }) productName: string;
  @Column({ type: 'int' }) quantity: number;
  @Column({ name: 'cost_price', type: 'decimal', precision: 10, scale: 2 }) costPrice: string;
  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 }) unitPrice: string;
  @Column({ name: 'discount_percent', type: 'decimal', precision: 5, scale: 2, default: 0 }) discountPercent: string;
  @Column({ name: 'line_total', type: 'decimal', precision: 10, scale: 2 }) lineTotal: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 }) profit: string;
}
