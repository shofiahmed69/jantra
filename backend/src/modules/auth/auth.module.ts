import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Owner } from '../../common/entities/owner.entity';
import { ActivityLog } from '../../common/entities/activity-log.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Owner, ActivityLog]),
    JwtModule.register({ secret: process.env.JWT_SECRET || 'change-me' }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
