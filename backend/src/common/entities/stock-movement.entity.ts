import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'product_id', type: 'uuid' }) productId: string;
  @Column({ name: 'movement_type', length: 30 }) movementType: string;
  @Column({ type: 'int' }) quantity: number;
  @Column({ name: 'reference_id', type: 'uuid', nullable: true }) referenceId?: string;
  @Column({ type: 'text', nullable: true }) note?: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
