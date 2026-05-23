import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SalesService } from './sales.service';
import { ReturnSaleItemDto } from './dto/return-sale-item.dto';
import { ListQueryDto } from '../../common/dto/list-query.dto';

@Controller('api/v1/sales')
export class SalesController {
  constructor(private readonly service: SalesService) {}

  @Get()
  async list(@Query() q: ListQueryDto, @Query('from') from?: string, @Query('to') to?: string, @Query('status') status?: string) {
    const result = await this.service.list(from, to, status, q.page, q.limit);
    return { success: true, data: result.items, message: 'OK', meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages } };
  }

  @Get('reports/daily') async daily(@Query('date') date?: string) { return { success: true, data: await this.service.daily(date), message: 'OK' }; }
  @Get('reports/weekly') async weekly() { return { success: true, data: await this.service.weekly(), message: 'OK' }; }
  @Get('reports/monthly') async monthly() { return { success: true, data: await this.service.monthly(), message: 'OK' }; }
  @Get('reports/yearly') async yearly() { return { success: true, data: await this.service.yearly(), message: 'OK' }; }
  @Get('reports/hourly') async hourly(@Query('date') date?: string) { return { success: true, data: await this.service.hourly(date), message: 'OK' }; }
  @Get('reports/product-wise') async productWise(@Query('from') from?: string, @Query('to') to?: string) { return { success: true, data: await this.service.productWise(from, to), message: 'OK' }; }

  @Get(':id') async get(@Param('id') id: string) { return { success: true, data: await this.service.getById(id), message: 'OK' }; }
  @Post(':id/cancel') async cancel(@Param('id') id: string) { return { success: true, data: await this.service.cancelSale(id), message: 'Cancelled' }; }
  @Post('return') async returnItem(@Body() body: ReturnSaleItemDto) { return { success: true, data: await this.service.returnItem(body), message: 'Returned' }; }
}
