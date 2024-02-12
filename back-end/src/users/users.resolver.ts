import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { Role } from '../roles/models/role.model';

@Resolver(() => User)
export class UsersResolver {
  public constructor(private usersService: UsersService) {}

  @Mutation(() => User)
  public async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.createUser(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  public async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Query(() => User, { name: 'user' })
  public async getUserById(@Args('id') id: string): Promise<User | null> {
    return this.usersService.getUserById(id);
  }

  @ResolveField(() => [Role])
  public async roles(@Parent() user: User): Promise<Role[]> {
    return user.roles;
  }
}
