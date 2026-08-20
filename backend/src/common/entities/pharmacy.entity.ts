import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from './base.entity';

@Entity('pharmacies')
export class Pharmacy extends AppBaseEntity {
  @Column({ length: 150 }) name: string;
  @Column({ type: 'text', nullable: true }) address?: string;
  @Column({ length: 20, default: 'active' }) status: string;
}
