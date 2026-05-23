import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from '../../common/entities/supplier.entity';
import { Purchase } from '../../common/entities/purchase.entity';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, Purchase])],
  controllers: [SuppliersController],
  providers: [SuppliersService],
})
export class SuppliersModule {}
