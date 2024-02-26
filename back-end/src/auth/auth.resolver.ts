import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from '../users/inputs/create-user.input';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { User } from '../users/models/user.model';
import { GqlLocalAuthGuard } from './guards/gql-local-auth/gql-local-auth.guard';
import { LoginInput } from './inputs/login.input';
import { GqlAuthGuard } from './guards/gql-auth/gql-auth.guard';

@Resolver()
export class AuthResolver {
  public constructor(private authService: AuthService) {}

  @Mutation(() => Boolean)
  public async registration(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<boolean> {
    await this.authService.registration(createUserInput);
    return true;
  }

  @UseGuards(GqlLocalAuthGuard)
  @Mutation(() => User)
  public async login(
    @Args('variables') _loginInput: LoginInput,
    @Context() context: { req: { user: User } },
  ): Promise<User> {
    return context.req.user;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User, { name: 'me' })
  public async getCurrentUser(
    @Context() context: { req: { user: User } },
  ): Promise<User> {
    return context.req.user;
  }
}
