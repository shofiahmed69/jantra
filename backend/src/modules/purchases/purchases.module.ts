import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from '../../common/entities/purchase.entity';
import { PurchaseItem } from '../../common/entities/purchase-item.entity';
import { Product } from '../../common/entities/product.entity';
import { StockMovement } from '../../common/entities/stock-movement.entity';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';

@Module({
  imports: [TypeOrmModule.forFeature([Purchase, PurchaseItem, Product, StockMovement])],
  controllers: [PurchasesController],
  providers: [PurchasesService],
})
export class PurchasesModule {}
