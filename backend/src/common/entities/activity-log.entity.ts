import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ length: 100 }) action: string;
  @Column({ length: 50 }) entity: string;
  @Column({ name: 'entity_id', nullable: true }) entityId?: string;
  @Column({ type: 'jsonb', nullable: true }) details?: Record<string, unknown>;
  @Column({ name: 'ip_address', length: 45, nullable: true }) ipAddress?: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
