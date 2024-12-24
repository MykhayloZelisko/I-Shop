import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
  ID,
} from '@nestjs/graphql';
import { CartDevicesService } from './cart-devices.service';
import { CartDevice } from './models/cart-device.model';
import { Device } from '../devices/models/device.model';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id/parse-object-id.pipe';
import { UpdateCartDeviceInput } from './inputs/update-cart-device.input';
import { ValidationPipe } from '../common/pipes/validation/validation.pipe';
import { DeletedCartDevice } from './models/deleted-cart-device.model';
import { ParseObjectIdArrayPipe } from '../common/pipes/parse-object-id-array/parse-object-id-array.pipe';
import { UpdateCartDevicesInput } from './inputs/update-cart-devices.input';

@Resolver(() => CartDevice)
export class CartDevicesResolver {
  public constructor(private cartDevicesService: CartDevicesService) {}

  @Mutation(() => CartDevice)
  public async addDeviceToCart(
    @Args('id', { type: () => ID }, ParseObjectIdPipe) id: string, // device id
    @Args('cartId', { type: () => ID }, ParseObjectIdPipe) cartId: string,
  ): Promise<CartDevice> {
    return this.cartDevicesService.addDeviceToCart(id, cartId);
  }

  @Mutation(() => CartDevice)
  public async updateCartDevice(
    @Args('id', { type: () => ID }, ParseObjectIdPipe) id: string,
    @Args('updateCartDeviceInput', ValidationPipe)
    updateCartDeviceInput: UpdateCartDeviceInput,
  ): Promise<CartDevice> {
    return this.cartDevicesService.updateCartDevice(id, updateCartDeviceInput);
  }

  @Mutation(() => DeletedCartDevice)
  public async deleteDevicesFromCart(
    @Args('ids', { type: () => [ID] }, ParseObjectIdArrayPipe) ids: string[],
    @Args('cartId', { type: () => ID }, ParseObjectIdPipe) cartId: string,
  ): Promise<DeletedCartDevice> {
    return this.cartDevicesService.deleteDevicesFromCart(ids, cartId);
  }

  @Mutation(() => Boolean)
  public async updateCartDevices(
    @Args('updateCartDevicesInput', ValidationPipe)
    updateCartDevicesInput: UpdateCartDevicesInput,
  ): Promise<boolean> {
    return this.cartDevicesService.updateCartDevices(updateCartDevicesInput);
  }

  @ResolveField(() => Device)
  public async device(@Parent() cartDevice: CartDevice): Promise<Device> {
    return cartDevice.device;
  }
}
