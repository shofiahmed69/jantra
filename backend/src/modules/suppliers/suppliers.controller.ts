import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { ListQueryDto } from '../../common/dto/list-query.dto';

@Controller('api/v1/suppliers')
export class SuppliersController {
  constructor(private readonly service: SuppliersService) {}

  @Get() async list(@Query() q: ListQueryDto) {
    const result = await this.service.list(q.page, q.limit);
    return { success: true, data: result.items, message: 'OK', meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages } };
  }
  @Post() async create(@Body() body: Record<string, unknown>) { return { success: true, data: await this.service.create(body), message: 'Created' }; }
  @Get(':id') async get(@Param('id') id: string) { return { success: true, data: await this.service.get(id), message: 'OK' }; }
  @Patch(':id') async update(@Param('id') id: string, @Body() body: Record<string, unknown>) { return { success: true, data: await this.service.update(id, body), message: 'Updated' }; }
  @Delete(':id') async remove(@Param('id') id: string) { return { success: true, data: await this.service.remove(id), message: 'Deleted' }; }

  @Get(':id/purchases') async purchases(@Param('id') id: string) { return { success: true, data: await this.service.purchases(id), message: 'OK' }; }
  @Get(':id/payment-records') async paymentRecords(@Param('id') id: string) { return { success: true, data: await this.service.paymentRecords(id), message: 'OK' }; }
}
