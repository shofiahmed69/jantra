import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../../common/entities/notification.entity';
import { Product } from '../../common/entities/product.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { ExpiryScheduler } from './expiry.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Product])],
  controllers: [NotificationsController],
  providers: [NotificationsService, ExpiryScheduler],
  exports: [NotificationsService],
})
export class NotificationsModule {}
