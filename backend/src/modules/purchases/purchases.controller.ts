import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { ListQueryDto } from '../../common/dto/list-query.dto';

@Controller('api/v1/purchases')
export class PurchasesController {
  constructor(private readonly service: PurchasesService) {}

  @Get() async list(@Query() q: ListQueryDto) {
    const result = await this.service.list(q.page, q.limit);
    return { success: true, data: result.items, message: 'OK', meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages } };
  }
  @Get('reports/supplier-wise') async supplierWise() { return { success: true, data: await this.service.supplierWise(), message: 'OK' }; }
  @Get('reports/cost-summary') async costSummary(@Query('from') from?: string, @Query('to') to?: string) { return { success: true, data: await this.service.costSummary(from, to), message: 'OK' }; }
  @Post() async create(@Body() body: CreatePurchaseDto) { return { success: true, data: await this.service.create(body), message: 'Created' }; }
  @Get(':id') async get(@Param('id') id: string) { return { success: true, data: await this.service.get(id), message: 'OK' }; }
  @Patch(':id') async update(@Param('id') id: string, @Body() body: Record<string, unknown>) { return { success: true, data: await this.service.update(id, body), message: 'Updated' }; }
}
