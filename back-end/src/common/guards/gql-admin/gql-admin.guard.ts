import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '../../../roles/models/role.model';

@Injectable()
export class GqlAdminGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const user = request.user;

    if (!request.isAuthenticated()) {
      throw new UnauthorizedException(
        'Session has expired or user is not authenticated',
      );
    }

    const isAdmin = user.roles.some(
      (role: Role) => role.role === 'administrator',
    );

    if (!isAdmin) {
      throw new ForbiddenException('Forbidden resource');
    }

    return true;
  }
}
