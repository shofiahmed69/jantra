import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../common/entities/product.entity';
import { BarcodesController } from './barcodes.controller';
import { BarcodesService } from './barcodes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [BarcodesController],
  providers: [BarcodesService],
})
export class BarcodesModule {}
