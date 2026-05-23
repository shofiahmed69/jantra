import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ReportsService } from './reports.service';

@Controller('api/v1/reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('sales') async sales(@Query('from') from?: string, @Query('to') to?: string) { return { success: true, data: await this.service.sales(from, to), message: 'OK' }; }
  @Get('inventory') async inventory() { return { success: true, data: await this.service.inventory(), message: 'OK' }; }
  @Get('profit-loss') async profitLoss(@Query('from') from?: string, @Query('to') to?: string) { return { success: true, data: await this.service.profitLoss(from, to), message: 'OK' }; }
  @Get('expenses') async expenses(@Query('from') from?: string, @Query('to') to?: string) { return { success: true, data: await this.service.expenses(from, to), message: 'OK' }; }
  @Get('expiry') async expiry(@Query('days') days?: string) { return { success: true, data: await this.service.expiry(days ? Number(days) : 30), message: 'OK' }; }

  @Get(':reportType/export/pdf')
  async exportPdf(@Param('reportType') reportType: string, @Res() res: Response) {
    const pdf = await this.service.exportPdf(reportType);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${reportType}.pdf"`);
    res.send(pdf);
  }

  @Get(':reportType/export/excel')
  async exportExcel(@Param('reportType') reportType: string, @Res() res: Response) {
    const xlsx = await this.service.exportExcel(reportType);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${reportType}.xlsx"`);
    res.send(xlsx);
  }

  @Get(':reportType/export/csv')
  async exportCsv(@Param('reportType') reportType: string, @Res() res: Response) {
    const csv = await this.service.exportCsv(reportType);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${reportType}.csv"`);
    res.send(csv);
  }
}
