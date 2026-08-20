import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Pharmacy } from './pharmacy.entity';

@Entity('owners')
export class Owner extends AppBaseEntity {
  @Column({ name: 'pharmacy_id', type: 'uuid' }) pharmacyId: string;
  @ManyToOne(() => Pharmacy, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'pharmacy_id' })
  pharmacy?: Pharmacy;
  @Column({ length: 100 }) name: string;
  @Column({ length: 150, unique: true }) email: string;
  @Column({ name: 'password_hash', length: 255 }) passwordHash: string;
  @Column({ length: 20, nullable: true }) phone?: string;
  @Column({ name: 'shop_name', length: 150 }) shopName: string;
  @Column({ name: 'shop_address', type: 'text', nullable: true }) shopAddress?: string;
  @Column({ name: 'avatar_url', length: 255, nullable: true }) avatarUrl?: string;
}
