import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('api/v1/dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('summary') async summary() { return { success: true, data: await this.service.summary(), message: 'OK' }; }
}
