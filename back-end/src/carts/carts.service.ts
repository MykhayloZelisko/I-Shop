import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cart as CartGQL } from './models/cart.model';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Model } from 'mongoose';
import { CartDeviceDocument } from '../cart-devices/schemas/cart-device.schema';
import { CartDevicesService } from '../cart-devices/cart-devices.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CartsService {
  public constructor(
    @InjectModel(Cart.name)
    private cartModel: Model<CartDocument>,
    private cartDevicesService: CartDevicesService,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
  ) {}

  public async createCart(deviceId: string, userId: string): Promise<CartGQL> {
    const device = await this.cartDevicesService.createCartDevice(deviceId);
    const newCart = await this.cartModel.create({ devices: [device.id] });
    const user = await this.usersService.getUserById(userId);
    user.cart = newCart.id;
    await user.save();
    await newCart.populate({
      path: 'devices',
      populate: { path: 'device' },
    });
    return newCart.toObject();
  }

  public async findCartById(id: string): Promise<CartDocument | null> {
    return this.cartModel.findById(id).exec();
  }

  public async addDeviceToCart(id: string, deviceId: string): Promise<void> {
    // cartDevice id
    const cart = await this.cartModel
      .findByIdAndUpdate(id, { $addToSet: { devices: deviceId } })
      .exec();
    if (!cart) {
      throw new NotFoundException('Cart not updated');
    }
  }

  public async updateCartPrices(id: string): Promise<CartGQL> {
    const cart: CartDocument | null = await this.cartModel
      .findById(id)
      .populate({
        path: 'devices',
        populate: { path: 'device' },
      })
      .exec();

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const updatePromises = cart.devices.map(
      async (cartDevice: CartDeviceDocument) => {
        if (cartDevice.device.price !== cartDevice.priceAtAdd) {
          cartDevice.priceAtAdd = cartDevice.device.price;
          return cartDevice.save();
        }
        return cartDevice;
      },
    );

    await Promise.all(updatePromises);
    return cart.toObject();
  }

  public async deleteDevicesFromCart(
    cartId: string,
    deviceIds: string[],
  ): Promise<void> {
    try {
      const cart = await this.cartModel
        .findByIdAndUpdate(
          cartId,
          {
            $pull: { devices: { $in: deviceIds } },
          },
          { new: true },
        )
        .exec();

      if (cart && !cart.devices.length) {
        await this.cartModel.findByIdAndDelete(cartId).exec();
      }
    } catch {
      throw new BadRequestException('Devices are not deleted from the cart');
    }
  }
}
