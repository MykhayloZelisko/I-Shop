import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { User } from './models/user.model';
import { Role } from '../roles/models/role.model';
import { Cart } from '../carts/models/cart.model';

@Resolver(() => User)
export class UsersResolver {
  @ResolveField(() => [Role])
  public async roles(@Parent() user: User): Promise<Role[]> {
    return user.roles;
  }

  @ResolveField(() => Cart, { nullable: true })
  public async cart(@Parent() user: User): Promise<Cart | null> {
    return user.cart;
  }
}
