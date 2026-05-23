import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { BarcodesService } from './barcodes.service';

@Controller('api/v1/barcodes')
export class BarcodesController {
  constructor(private readonly service: BarcodesService) {}

  @Get('generate/:productId')
  async generate(@Param('productId') productId: string) {
    return { success: true, data: await this.service.generate(productId), message: 'OK' };
  }

  @Get('print-sheet')
  async printSheet(@Query('productIds') productIds: string, @Res() res: Response) {
    const ids = (productIds || '').split(',').map((x) => x.trim()).filter(Boolean);
    const pdf = await this.service.printSheet(ids);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="barcode-sheet.pdf"');
    res.send(pdf);
  }
}
