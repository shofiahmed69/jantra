import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductsModule } from './modules/products/products.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { PosModule } from './modules/pos/pos.module';
import { SalesModule } from './modules/sales/sales.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AuthModule } from './modules/auth/auth.module';
import { ReportsModule } from './modules/reports/reports.module';
import { BarcodesModule } from './modules/barcodes/barcodes.module';
import { JwtAuthGuard } from './common/auth/jwt-auth.guard';
import { buildTypeOrmOptions } from './database/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'change-me',
      signOptions: { expiresIn: '24h' },
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(buildTypeOrmOptions()),
    AuthModule,
    DashboardModule,
    ProductsModule,
    InventoryModule,
    PosModule,
    SalesModule,
    ExpensesModule,
    SuppliersModule,
    PurchasesModule,
    NotificationsModule,
    ReportsModule,
    BarcodesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
