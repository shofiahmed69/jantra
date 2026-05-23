import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from '../../common/entities/sale.entity';
import { SaleItem } from '../../common/entities/sale-item.entity';
import { SaleReturn } from '../../common/entities/sale-return.entity';
import { Product } from '../../common/entities/product.entity';
import { StockMovement } from '../../common/entities/stock-movement.entity';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, SaleItem, SaleReturn, Product, StockMovement])],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
