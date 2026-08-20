import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../common/entities/notification.entity';
import { TenantContext } from '../../common/tenant/tenant.context';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private readonly notificationRepo: Repository<Notification>,
    private readonly tenant: TenantContext,
  ) {}

  private get pid() {
    return this.tenant.pharmacyId;
  }

  async list(page = 1, limit = 20) {
    const [items, total] = await this.notificationRepo.findAndCount({
      where: { pharmacyId: this.pid },
      order: { isRead: 'ASC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async createIfMissingUnread(type: string, productId: string | undefined, message: string, pharmacyId?: string) {
    if (!productId) return;
    const pid = pharmacyId || this.pid;
    const existing = await this.notificationRepo.findOne({
      where: { type, productId, isRead: false, pharmacyId: pid },
    });
    if (existing) return existing;
    return this.notificationRepo.save(
      this.notificationRepo.create({ type, productId, message, isRead: false, pharmacyId: pid }),
    );
  }

  async markRead(id: string) {
    await this.notificationRepo.update({ id, pharmacyId: this.pid }, { isRead: true });
    return { id, isRead: true };
  }

  async markAllRead() {
    await this.notificationRepo
      .createQueryBuilder()
      .update(Notification)
      .set({ isRead: true })
      .where('is_read = :isRead', { isRead: false })
      .andWhere('pharmacy_id = :pid', { pid: this.pid })
      .execute();
    return { updated: true };
  }
}
