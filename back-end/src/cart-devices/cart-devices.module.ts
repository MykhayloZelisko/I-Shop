import { forwardRef, Module } from '@nestjs/common';
import { CartDevicesService } from './cart-devices.service';
import { CartDevicesResolver } from './cart-devices.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { CartDevice, CartDeviceSchema } from './schemas/cart-device.schema';
import { CartsModule } from '../carts/carts.module';
import { DevicesModule } from '../devices/devices.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CartDevice.name, schema: CartDeviceSchema },
    ]),
    forwardRef(() => CartsModule),
    DevicesModule,
    CommonModule,
  ],
  providers: [CartDevicesResolver, CartDevicesService],
  exports: [CartDevicesService],
})
export class CartDevicesModule {}
