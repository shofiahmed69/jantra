import type { DataSourceOptions } from 'typeorm';
import { Owner } from '../common/entities/owner.entity';
import { Category } from '../common/entities/category.entity';
import { Product } from '../common/entities/product.entity';
import { StockMovement } from '../common/entities/stock-movement.entity';
import { Sale } from '../common/entities/sale.entity';
import { SaleItem } from '../common/entities/sale-item.entity';
import { SaleReturn } from '../common/entities/sale-return.entity';
import { Expense } from '../common/entities/expense.entity';
import { Supplier } from '../common/entities/supplier.entity';
import { Purchase } from '../common/entities/purchase.entity';
import { PurchaseItem } from '../common/entities/purchase-item.entity';
import { Notification } from '../common/entities/notification.entity';
import { ActivityLog } from '../common/entities/activity-log.entity';

const entities = [
  Owner,
  Category,
  Product,
  StockMovement,
  Sale,
  SaleItem,
  SaleReturn,
  Expense,
  Supplier,
  Purchase,
  PurchaseItem,
  Notification,
  ActivityLog,
];

export function buildTypeOrmOptions(): DataSourceOptions {
  const databaseUrl = process.env.DATABASE_URL;
  const common = {
    type: 'postgres' as const,
    entities,
    synchronize: process.env.DB_SYNC === 'true',
    migrations: ['dist/database/migrations/*.js'],
    migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
  };

  if (databaseUrl) {
    return {
      ...common,
      url: databaseUrl,
      ssl: { rejectUnauthorized: false },
    };
  }

  return {
    ...common,
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'pharmacy_db',
  };
}
