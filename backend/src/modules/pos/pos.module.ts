import { Module } from '@nestjs/common';
import { PosController } from './pos.controller';
import { PosService } from './pos.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { DashboardModule } from '../dashboard/dashboard.module';

@Module({
  imports: [NotificationsModule, DashboardModule],
  controllers: [PosController],
  providers: [PosService],
})
export class PosModule {}
