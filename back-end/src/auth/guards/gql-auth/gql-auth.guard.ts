import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlAuthGuard extends AuthGuard('session') {
  public getRequest(context: ExecutionContext): unknown {
    const ctx = GqlExecutionContext.create(context);
    const gqlReq = ctx.getContext().req;
    if (gqlReq) {
      const { variables } = ctx.getArgs();
      gqlReq.body = variables;
      return gqlReq;
    }
    return context.switchToHttp().getRequest();
  }
}
