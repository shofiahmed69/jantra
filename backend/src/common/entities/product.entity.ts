import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Category } from './category.entity';

@Entity('products')
export class Product extends AppBaseEntity {
  @Column({ length: 150 }) name: string;
  @Column({ name: 'image_url', type: 'text', nullable: true }) imageUrl?: string;
  @Column({ length: 100, unique: true, nullable: true }) barcode?: string;
  @Column({ name: 'category_id', type: 'uuid', nullable: true }) categoryId?: string;
  @ManyToOne(() => Category, { nullable: true }) @JoinColumn({ name: 'category_id' }) category?: Category;
  @Column({ name: 'brand_name', length: 100, nullable: true }) brandName?: string;
  @Column({ name: 'generic_name', length: 150, nullable: true }) genericName?: string;
  @Column({ name: 'batch_number', length: 100, nullable: true }) batchNumber?: string;
  @Column({ name: 'expiry_date', type: 'date', nullable: true }) expiryDate?: string;
  @Column({ name: 'cost_price', type: 'decimal', precision: 10, scale: 2 }) costPrice: string;
  @Column({ name: 'selling_price', type: 'decimal', precision: 10, scale: 2 }) sellingPrice: string;
  @Column({ name: 'stock_quantity', type: 'int', default: 0 }) stockQuantity: number;
  @Column({ name: 'min_stock_alert', type: 'int', default: 10 }) minStockAlert: number;
  @Column({ name: 'unit_type', length: 30 }) unitType: string;
  @Column({ type: 'text', nullable: true }) description?: string;
  @DeleteDateColumn({ name: 'deleted_at', nullable: true }) deletedAt?: Date;
}
