import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../common/entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(@InjectRepository(Notification) private readonly notificationRepo: Repository<Notification>) {}

  async list(page = 1, limit = 20) {
    const [items, total] = await this.notificationRepo.findAndCount({
      order: { isRead: 'ASC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async createIfMissingUnread(type: string, productId: string | undefined, message: string) {
    if (!productId) return;
    const existing = await this.notificationRepo.findOne({ where: { type, productId, isRead: false } });
    if (existing) return existing;
    return this.notificationRepo.save(this.notificationRepo.create({ type, productId, message, isRead: false }));
  }

  async markRead(id: string) {
    await this.notificationRepo.update(id, { isRead: true });
    return { id, isRead: true };
  }

  async markAllRead() {
    await this.notificationRepo.createQueryBuilder().update(Notification).set({ isRead: true }).where('is_read = :isRead', { isRead: false }).execute();
    return { updated: true };
  }
}
