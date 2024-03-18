import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlLocalAuthGuard extends AuthGuard('local') {
  public getRequest(context: ExecutionContext): unknown {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    request.body = ctx.getArgs().variables;
    return request;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    await super.logIn(request);
    return result;
  }
}
