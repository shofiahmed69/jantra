import { Body, Controller, Get, Patch, Post, Req, UnauthorizedException } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ProvisionPharmacyDto } from './dto/provision-pharmacy.dto';
import { Public } from '../../common/auth/public.decorator';
import { CurrentUser } from '../../common/auth/current-user.decorator';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Throttle({ login: { limit: 8, ttl: 60_000 } })
  @Post('login')
  async login(@Body() body: LoginDto, @Req() req: Request) {
    return { success: true, data: await this.service.login(body.email, body.password, req.ip), message: 'Login successful' };
  }

  @Get('profile')
  async profile(@CurrentUser() user?: { sub: string }) {
    if (!user?.sub) throw new UnauthorizedException('Unauthorized');
    const ownerId = user.sub;
    return { success: true, data: await this.service.profile(ownerId), message: 'OK' };
  }

  @Patch('profile')
  async updateProfile(@CurrentUser() user: { sub: string } | undefined, @Body() body: Record<string, unknown>) {
    if (!user?.sub) throw new UnauthorizedException('Unauthorized');
    const ownerId = user.sub;
    return { success: true, data: await this.service.updateProfile(ownerId, body), message: 'Updated' };
  }

  @Post('change-password')
  async changePassword(@CurrentUser() user: { sub: string } | undefined, @Body() body: ChangePasswordDto) {
    if (!user?.sub) throw new UnauthorizedException('Unauthorized');
    const ownerId = user.sub;
    return { success: true, data: await this.service.changePassword(ownerId, body.current_password, body.new_password), message: 'Password changed' };
  }

  /** Platform admin only — creates a new pharmacy + owner login */
  @Post('provision-pharmacy')
  async provisionPharmacy(@CurrentUser() user: { email: string } | undefined, @Body() body: ProvisionPharmacyDto) {
    if (!user?.email) throw new UnauthorizedException('Unauthorized');
    return {
      success: true,
      data: await this.service.provisionPharmacy(user.email, body),
      message: 'Pharmacy account created',
    };
  }
}
