import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GuestCart as GuestCartGQL } from './models/guest-cart.model';
import { GuestCart, GuestCartDocument } from './schemas/guest-cart.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartDevicesService } from '../cart-devices/cart-devices.service';
import { CartDeviceDocument } from '../cart-devices/schemas/cart-device.schema';

@Injectable()
export class GuestCartsService {
  public constructor(
    @InjectModel(GuestCart.name)
    private guestCartModel: Model<GuestCartDocument>,
    private cartDevicesService: CartDevicesService,
  ) {}

  public async createGuestCart(deviceId: string): Promise<GuestCartGQL> {
    const device = await this.cartDevicesService.createCartDevice(deviceId);
    const newCart = await this.guestCartModel.create({ devices: [device.id] });
    await newCart.populate({
      path: 'devices',
      populate: { path: 'device' },
    });
    return newCart.toObject();
  }

  public async getGuestCartById(id: string): Promise<GuestCartGQL | null> {
    const guestCart = await this.guestCartModel
      .findById(id)
      .populate({
        path: 'devices',
        populate: { path: 'device' },
      })
      .exec();
    return guestCart ? guestCart.toObject() : null;
  }

  public async addDeviceToGuestCart(
    id: string,
    deviceId: string,
  ): Promise<void> {
    // cartDevice id
    const cart = await this.guestCartModel
      .findByIdAndUpdate(id, { $addToSet: { devices: deviceId } })
      .exec();
    if (!cart) {
      throw new NotFoundException('Cart not updated');
    }
  }

  public async updateGuestCartPrices(id: string): Promise<GuestCartGQL> {
    const guestCart: GuestCartDocument | null = await this.guestCartModel
      .findById(id)
      .populate({
        path: 'devices',
        populate: { path: 'device' },
      })
      .exec();

    if (!guestCart) {
      throw new NotFoundException('Cart not found');
    }

    const updatePromises = guestCart.devices.map(
      async (cartDevice: CartDeviceDocument) => {
        if (cartDevice.device.price !== cartDevice.priceAtAdd) {
          cartDevice.priceAtAdd = cartDevice.device.price;
          return cartDevice.save();
        }
        return cartDevice;
      },
    );

    await Promise.all(updatePromises);
    return guestCart.toObject();
  }

  public async deleteDevicesFromGuestCart(
    cartId: string,
    deviceIds: string[],
  ): Promise<void> {
    try {
      const cart = await this.guestCartModel
        .findByIdAndUpdate(
          cartId,
          {
            $pull: { devices: { $in: deviceIds } },
          },
          { new: true },
        )
        .exec();

      if (cart && !cart.devices.length) {
        await this.guestCartModel.findByIdAndDelete(cartId).exec();
      }
    } catch {
      throw new BadRequestException('Devices are not deleted from the cart');
    }
  }
}
