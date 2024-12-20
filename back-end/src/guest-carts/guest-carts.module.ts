import { Module } from '@nestjs/common';
import { GuestCartsService } from './guest-carts.service';
import { GuestCartsResolver } from './guest-carts.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { GuestCart, GuestCartSchema } from './schemas/guest-cart.schema';
import { CartDevicesModule } from '../cart-devices/cart-devices.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GuestCart.name, schema: GuestCartSchema },
    ]),
    CartDevicesModule,
  ],
  providers: [GuestCartsResolver, GuestCartsService],
})
export class GuestCartsModule {}
