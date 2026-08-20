import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from '../../common/entities/owner.entity';
import { Pharmacy } from '../../common/entities/pharmacy.entity';
import { ActivityLog } from '../../common/entities/activity-log.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Owner, Pharmacy, ActivityLog])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
