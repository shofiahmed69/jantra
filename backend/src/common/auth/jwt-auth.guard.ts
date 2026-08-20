import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';
import { getJwtSecret } from '../security/env';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request & { user?: { sub: string; email: string; pharmacyId: string } }>();
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) throw new UnauthorizedException('Missing token');

    const token = auth.slice(7);
    try {
      const decoded = this.jwtService.verify<{ sub: string; email: string; pharmacyId?: string }>(token, {
        secret: getJwtSecret(),
      });
      if (!decoded.pharmacyId) throw new UnauthorizedException('Session expired — please sign in again');
      request.user = { sub: decoded.sub, email: decoded.email, pharmacyId: decoded.pharmacyId };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
