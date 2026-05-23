import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ListQueryDto } from '../../common/dto/list-query.dto';

@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get() async list(@Query() q: ListQueryDto) {
    const result = await this.service.list(q.page, q.limit);
    return { success: true, data: result.items, message: 'OK', meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages } };
  }
  @Get('barcode/:code') async barcode(@Param('code') code: string) { return { success: true, data: await this.service.findByBarcode(code), message: 'OK' }; }
  @Get('categories/all') async categories() { return { success: true, data: await this.service.categories(), message: 'OK' }; }
  @Post() async create(@Body() body: Record<string, unknown>) { return { success: true, data: await this.service.create(body), message: 'Created' }; }
  @Get(':id') async get(@Param('id') id: string) { return { success: true, data: await this.service.get(id), message: 'OK' }; }
  @Patch(':id') async update(@Param('id') id: string, @Body() body: Record<string, unknown>) { return { success: true, data: await this.service.update(id, body), message: 'Updated' }; }
  @Delete(':id') async remove(@Param('id') id: string) { return { success: true, data: await this.service.remove(id), message: 'Deleted' }; }
  @Post('categories') async createCategory(@Body() body: Record<string, unknown>) { return { success: true, data: await this.service.createCategory(body), message: 'Created' }; }
}
