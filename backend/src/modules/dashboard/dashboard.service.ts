import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../common/entities/product.entity';
import { Sale } from '../../common/entities/sale.entity';
import { SaleItem } from '../../common/entities/sale-item.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(Sale) private readonly saleRepo: Repository<Sale>,
    @InjectRepository(SaleItem) private readonly saleItemRepo: Repository<SaleItem>,
  ) {}

  async summary() {
    const [totalProducts, totalTransactions] = await Promise.all([
      this.productRepo.count(),
      this.saleRepo.count({ where: { status: 'completed' } }),
    ]);

    const todaySales = await this.saleRepo
      .createQueryBuilder('s')
      .select('COALESCE(SUM(s.total_amount), 0)', 'amount')
      .where("s.status = 'completed'")
      .andWhere('DATE(s.sale_date) = CURRENT_DATE')
      .getRawOne<{ amount: string }>();

    const todayProfit = await this.saleItemRepo
      .createQueryBuilder('si')
      .innerJoin(Sale, 's', 's.id = si.sale_id')
      .select('COALESCE(SUM(si.profit), 0)', 'amount')
      .where("s.status = 'completed'")
      .andWhere('DATE(s.sale_date) = CURRENT_DATE')
      .getRawOne<{ amount: string }>();

    return {
      todaySalesAmount: Number(todaySales?.amount || 0),
      todayProfit: Number(todayProfit?.amount || 0),
      totalTransactions,
      totalProducts,
    };
  }
}
