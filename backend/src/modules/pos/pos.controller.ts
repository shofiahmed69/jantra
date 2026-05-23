import { Controller, Get, Param, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { PosService } from './pos.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('api/v1/pos')
export class PosController {
  constructor(private readonly service: PosService) {}

  @Post('sale')
  async createSale(@Body() body: CreateSaleDto) {
    return { success: true, data: await this.service.createSale(body), message: 'Sale completed' };
  }

  @Get('invoice/:saleId')
  async invoice(@Param('saleId') saleId: string) {
    return { success: true, data: await this.service.getInvoiceData(saleId), message: 'OK' };
  }

  @Get('invoice/:saleId/print')
  async invoicePrint(@Param('saleId') saleId: string, @Res() res: Response) {
    const html = await this.service.getThermalInvoiceHtml(saleId);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  }

  @Get('invoice/:saleId/pdf')
  async invoicePdf(@Param('saleId') saleId: string, @Res() res: Response) {
    const pdf = await this.service.getInvoicePdf(saleId);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="invoice-${saleId}.pdf"`);
    res.send(pdf);
  }
}
