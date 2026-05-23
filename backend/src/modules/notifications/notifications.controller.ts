import { Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ListQueryDto } from '../../common/dto/list-query.dto';

@Controller('api/v1/notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get() async list(@Query() q: ListQueryDto) {
    const result = await this.service.list(q.page, q.limit);
    return { success: true, data: result.items, message: 'OK', meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages } };
  }
  @Patch(':id/read') async read(@Param('id') id: string) { return { success: true, data: await this.service.markRead(id), message: 'Updated' }; }
  @Post('mark-all-read') async readAll() { return { success: true, data: await this.service.markAllRead(), message: 'Updated' }; }
}
