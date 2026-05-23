import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from '../../common/entities/sale.entity';
import { Product } from '../../common/entities/product.entity';
import { Expense } from '../../common/entities/expense.entity';
import { SaleItem } from '../../common/entities/sale-item.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, Product, Expense, SaleItem])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
