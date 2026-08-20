import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'pharmacy_id', type: 'uuid' }) pharmacyId: string;
  @Column({ length: 150 }) name: string;
  @Column({ name: 'contact_person', length: 100, nullable: true }) contactPerson?: string;
  @Column({ length: 20, nullable: true }) phone?: string;
  @Column({ length: 150, nullable: true }) email?: string;
  @Column({ type: 'text', nullable: true }) address?: string;
  @Column({ type: 'text', nullable: true }) note?: string;
  @DeleteDateColumn({ name: 'deleted_at', nullable: true }) deletedAt?: Date;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
