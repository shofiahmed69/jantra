import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../common/entities/product.entity';
import { Sale } from '../../common/entities/sale.entity';
import { SaleItem } from '../../common/entities/sale-item.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardGateway } from '../../common/realtime/dashboard.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Sale, SaleItem])],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardGateway],
  exports: [DashboardGateway],
})
export class DashboardModule {}
