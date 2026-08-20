import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'pharmacy_id', type: 'uuid' }) pharmacyId: string;
  @Column({ length: 50 }) category: string;
  @Column({ length: 255 }) description: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 }) amount: string;
  @Column({ name: 'expense_date', type: 'date' }) expenseDate: string;
  @Column({ type: 'text', nullable: true }) note?: string;
  @DeleteDateColumn({ name: 'deleted_at', nullable: true }) deletedAt?: Date;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
