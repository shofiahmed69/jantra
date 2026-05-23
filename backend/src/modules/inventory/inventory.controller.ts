import { Controller, Get } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('api/v1/inventory')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Get('stock') async stock() { return { success: true, data: await this.service.stock(), message: 'OK' }; }
  @Get('low-stock') async lowStock() { return { success: true, data: await this.service.lowStock(), message: 'OK' }; }
  @Get('out-of-stock') async outOfStock() { return { success: true, data: await this.service.outOfStock(), message: 'OK' }; }
}
