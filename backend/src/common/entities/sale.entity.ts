import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'invoice_number', length: 30, unique: true }) invoiceNumber: string;
  @Column({ name: 'sale_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) saleDate: Date;
  @Column({ name: 'subtotal', type: 'decimal', precision: 10, scale: 2 }) subtotal: string;
  @Column({ name: 'discount_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }) discountAmount: string;
  @Column({ name: 'tax_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }) taxAmount: string;
  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 }) totalAmount: string;
  @Column({ name: 'payment_method', length: 20 }) paymentMethod: string;
  @Column({ name: 'payment_reference', length: 100, nullable: true }) paymentReference?: string;
  @Column({ length: 20, default: 'completed' }) status: string;
  @Column({ type: 'text', nullable: true }) note?: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
