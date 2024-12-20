import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { GuestCartsService } from './guest-carts.service';
import { GuestCart } from './models/guest-cart.model';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id/parse-object-id.pipe';
import { CartDevice } from '../cart-devices/models/cart-device.model';

@Resolver(() => GuestCart)
export class GuestCartsResolver {
  public constructor(private guestCartsService: GuestCartsService) {}

  @Mutation(() => GuestCart)
  public async createGuestCart(
    @Args('deviceId', { type: () => ID }, ParseObjectIdPipe) deviceId: string,
  ): Promise<GuestCart> {
    return this.guestCartsService.createGuestCart(deviceId);
  }

  @Query(() => GuestCart, { name: 'guestCart' })
  public async getGuestCart(
    @Args('id', { type: () => ID }, ParseObjectIdPipe) id: string,
  ): Promise<GuestCart | null> {
    return this.guestCartsService.getGuestCartById(id);
  }

  // @Mutation(() => GuestCart)
  // updateGuestCart(@Args('updateGuestCartInput') updateGuestCartInput: UpdateGuestCartInput) {
  //   return this.guestCartsService.update(updateGuestCartInput.id, updateGuestCartInput);
  // }
  //
  // @Mutation(() => GuestCart)
  // removeGuestCart(@Args('id', { type: () => Int }) id: number) {
  //   return this.guestCartsService.remove(id);
  // }

  @ResolveField(() => [CartDevice])
  public async devices(@Parent() cart: GuestCart): Promise<CartDevice[]> {
    return cart.devices;
  }
}
