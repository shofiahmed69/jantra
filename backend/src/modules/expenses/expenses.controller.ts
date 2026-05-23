import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ListQueryDto } from '../../common/dto/list-query.dto';

@Controller('api/v1/expenses')
export class ExpensesController {
  constructor(private readonly service: ExpensesService) {}

  @Get() async list(@Query() q: ListQueryDto, @Query('from') from?: string, @Query('to') to?: string, @Query('category') category?: string) {
    const result = await this.service.list(from, to, category, q.page, q.limit);
    return { success: true, data: result.items, message: 'OK', meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages } };
  }

  @Post() async create(@Body() body: CreateExpenseDto) {
    return { success: true, data: await this.service.create(body), message: 'Created' };
  }

  @Patch(':id') async update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { success: true, data: await this.service.update(id, body), message: 'Updated' };
  }

  @Delete(':id') async remove(@Param('id') id: string) {
    return { success: true, data: await this.service.remove(id), message: 'Deleted' };
  }

  @Get('reports/daily') async daily(@Query('date') date?: string) {
    return { success: true, data: await this.service.daily(date), message: 'OK' };
  }

  @Get('reports/monthly') async monthly(@Query('month') month?: string) {
    return { success: true, data: await this.service.monthly(month), message: 'OK' };
  }
}
