import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { PayloadType } from '../types';
import { ROLE } from '../metadata';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as PayloadType;
  },
);

export const ROLES_METADATA = 'roles';
export const RolesDecorator = (...roles: ROLE[]) =>
  SetMetadata(ROLES_METADATA, roles);
