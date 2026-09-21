import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedRequest } from './auth.guard';
import { AuthUser } from './auth.types';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<AuthUser['role'][]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!roles) return true;
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (roles.includes(request.user.role)) return true;
    throw new ForbiddenException('No tienes permisos para esta accion.');
  }
}
