import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UsersService } from '../../../users/users.service';

@Injectable()
export class UpdateUserInSessionInterceptor implements NestInterceptor {
  public constructor(private usersService: UsersService) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    if (request.isAuthenticated() && request.user) {
      const userId = request.user.id;
      request.user = await this.usersService.getUserObjectById(userId);
    }

    return next.handle();
  }
}
