import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('purchase_items')
export class PurchaseItem {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'purchase_id', type: 'uuid' }) purchaseId: string;
  @Column({ name: 'product_id', type: 'uuid' }) productId: string;
  @Column({ type: 'int' }) quantity: number;
  @Column({ name: 'cost_per_unit', type: 'decimal', precision: 10, scale: 2 }) costPerUnit: string;
  @Column({ name: 'batch_number', length: 100, nullable: true }) batchNumber?: string;
  @Column({ name: 'expiry_date', type: 'date', nullable: true }) expiryDate?: string;
  @Column({ name: 'line_total', type: 'decimal', precision: 10, scale: 2 }) lineTotal: string;
}
