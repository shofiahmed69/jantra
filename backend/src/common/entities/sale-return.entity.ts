import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sale_returns')
export class SaleReturn {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'sale_id', type: 'uuid' }) saleId: string;
  @Column({ name: 'sale_item_id', type: 'uuid' }) saleItemId: string;
  @Column({ name: 'quantity_returned', type: 'int' }) quantityReturned: number;
  @Column({ name: 'refund_amount', type: 'decimal', precision: 10, scale: 2 }) refundAmount: string;
  @Column({ type: 'text', nullable: true }) reason?: string;
  @Column({ name: 'return_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) returnDate: Date;
  @Column({ default: true }) restock: boolean;
}
