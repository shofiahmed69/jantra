import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ length: 30 }) type: string;
  @Column({ name: 'product_id', type: 'uuid', nullable: true }) productId?: string;
  @Column({ type: 'text' }) message: string;
  @Column({ name: 'is_read', default: false }) isRead: boolean;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
