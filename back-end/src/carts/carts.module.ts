import { forwardRef, Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsResolver } from './carts.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { CartDevicesModule } from '../cart-devices/cart-devices.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    CartDevicesModule,
    forwardRef(() => UsersModule),
  ],
  providers: [CartsResolver, CartsService],
  exports: [CartsService],
})
export class CartsModule {}
