import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'pharmacy_id', type: 'uuid' }) pharmacyId: string;
  @Column({ name: 'supplier_id', type: 'uuid', nullable: true }) supplierId?: string;
  @Column({ name: 'purchase_date', type: 'date' }) purchaseDate: string;
  @Column({ name: 'invoice_ref', length: 100, nullable: true }) invoiceRef?: string;
  @Column({ name: 'total_cost', type: 'decimal', precision: 10, scale: 2 }) totalCost: string;
  @Column({ name: 'payment_status', length: 20, default: 'paid' }) paymentStatus: string;
  @Column({ name: 'amount_paid', type: 'decimal', precision: 10, scale: 2, default: 0 }) amountPaid: string;
  @Column({ type: 'text', nullable: true }) note?: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
