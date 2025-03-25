import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE } from '../metadata';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const jwtPayload = request.user;

    if (!jwtPayload) {
      console.log('\u001b[31m Auth guard not implemented in method');
      throw new InternalServerErrorException();
    }

    const isValidRole = this.matchRoles(roles, jwtPayload.roles);

    return isValidRole;
  }

  private matchRoles(
    requiredRoles: Array<ROLE>,
    rolesOfTheStudent: Array<ROLE>,
  ) {
    return requiredRoles.some((role) => rolesOfTheStudent.includes(role));
  }
}
