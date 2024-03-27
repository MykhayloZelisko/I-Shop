import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '../../../roles/models/role.model';

@Injectable()
export class GqlAdminGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const user = request.user;

    if (!request.isAuthenticated()) {
      return false;
    }

    return user.roles.some((role: Role) => role.role === 'administrator');
  }
}
