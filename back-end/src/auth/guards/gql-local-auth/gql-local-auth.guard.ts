import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

@Injectable()
export class GqlLocalAuthGuard extends AuthGuard('local') {
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
