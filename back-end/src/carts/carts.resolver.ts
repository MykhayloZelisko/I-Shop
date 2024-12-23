import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
  ID,
  Context, Query,
} from '@nestjs/graphql';
import { CartsService } from './carts.service';
import { Cart } from './models/cart.model';
import { CartDevice } from '../cart-devices/models/cart-device.model';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id/parse-object-id.pipe';
import { User } from '../users/models/user.model';

@Resolver(() => Cart)
export class CartsResolver {
  public constructor(private cartsService: CartsService) {}

  @Mutation(() => Cart)
  public async createCart(
    @Args('deviceId', { type: () => ID }, ParseObjectIdPipe) deviceId: string,
    @Context() context: { req: { user: User } },
  ): Promise<Cart> {
    return this.cartsService.createCart(deviceId, context.req.user);
  }

  @Query(() => Cart, { name: 'guestCart' })
  public async getGuestCart(
    @Args('id', { type: () => ID }, ParseObjectIdPipe) id: string,
  ): Promise<Cart | null> {
    return this.cartsService.getGuestCart(id);
  }

  @ResolveField(() => [CartDevice])
  public async devices(@Parent() cart: Cart): Promise<CartDevice[]> {
    return cart.devices;
  }
}
