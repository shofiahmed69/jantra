import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../common/entities/product.entity';
import { NotificationsService } from './notifications.service';

@Injectable()
export class ExpiryScheduler {
  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    private readonly notifications: NotificationsService,
  ) {}

  @Cron('5 0 * * *')
  async checkExpiringProducts() {
    const rows = await this.productRepo
      .createQueryBuilder('p')
      .where('p.expiry_date IS NOT NULL')
      .andWhere("p.expiry_date <= CURRENT_DATE + INTERVAL '30 days'")
      .getMany();

    for (const p of rows) {
      await this.notifications.createIfMissingUnread('expiry', p.id, `${p.name} is expiring soon (${p.expiryDate})`);
    }
  }
}
