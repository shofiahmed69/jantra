import { Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';

export type AuthUser = { sub: string; email: string; pharmacyId: string };

@Injectable({ scope: Scope.REQUEST })
export class TenantContext {
  constructor(@Inject(REQUEST) private readonly req: Request & { user?: AuthUser }) {}

  get pharmacyId(): string {
    const id = this.req.user?.pharmacyId;
    if (!id) throw new UnauthorizedException('Pharmacy context missing — sign in again');
    return id;
  }
}
