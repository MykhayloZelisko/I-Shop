import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Cart as CartGQL } from './models/cart.model';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { ClientSession, Model } from 'mongoose';
import { CartDeviceDocument } from '../cart-devices/schemas/cart-device.schema';
import { CartDevicesService } from '../cart-devices/cart-devices.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/models/user.model';
import { TransactionsService } from '../common/services/transactions/transactions.service';

@Injectable()
export class CartsService {
  public constructor(
    @InjectModel(Cart.name)
    private cartModel: Model<CartDocument>,
    private cartDevicesService: CartDevicesService,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    private transactionsService: TransactionsService,
  ) {}

  public async createCart(
    deviceId: string,
    user: User | undefined,
  ): Promise<CartGQL> {
    return this.transactionsService.execute<CartGQL>(async (session) => {
      const device = await this.cartDevicesService.createCartDevice(
        deviceId,
        session,
      );
      const userId = user ? user.id.toString() : undefined;
      let newCart: CartDocument;
      if (userId) {
        const userDB = await this.usersService.getUserById(userId);
        [newCart] = await this.cartModel.create(
          [
            {
              devices: [device.id],
              isGuest: false,
            },
          ],
          { session },
        );
        userDB.cart = newCart.id;
        await userDB.save({ session });
      } else {
        [newCart] = await this.cartModel.create(
          [
            {
              devices: [device.id],
              isGuest: true,
            },
          ],
          { session },
        );
      }
      await newCart.populate({
        path: 'devices',
        populate: { path: 'device' },
      });
      return newCart.toObject<CartGQL>();
    });
  }

  public async getCartById(id: string): Promise<CartDocument | null> {
    return this.cartModel.findById(id).exec();
  }

  public async addDeviceToCart(
    id: string,
    deviceId: string,
    session: ClientSession,
  ): Promise<void> {
    // cartDevice id
    const cart = await this.cartModel
      .findByIdAndUpdate(id, { $addToSet: { devices: deviceId } })
      .session(session)
      .exec();
    if (!cart) {
      throw new NotFoundException('Cart not updated');
    }
  }

  public async updateCartPrices(id: string): Promise<CartGQL> {
    const cart = await this.cartModel
      .findById(id)
      .populate({
        path: 'devices',
        populate: { path: 'device' },
      })
      .exec();

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return this.transactionsService.execute<CartGQL>(async (session) => {
      const updatePromises = cart.devices.map(
        async (cartDevice: CartDeviceDocument) => {
          if (cartDevice.device.price !== cartDevice.priceAtAdd) {
            cartDevice.priceAtAdd = cartDevice.device.price;
            return cartDevice.save({ session });
          }
          return cartDevice;
        },
      );

      cart.devices = await Promise.all(updatePromises);

      return cart.toObject<CartGQL>();
    });
  }

  public async deleteDevicesFromCart(
    cartId: string,
    deviceIds: string[],
    session: ClientSession,
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
        .session(session)
        .exec();

      if (cart && !cart.devices.length) {
        await this.cartModel.findByIdAndDelete(cartId).session(session).exec();
      }
    } catch {
      throw new BadRequestException('Devices are not deleted from the cart');
    }
  }

  public async getGuestCart(id: string): Promise<CartGQL | null> {
    try {
      const isGuestCart = await this.cartModel
        .exists({ _id: id, isGuest: true })
        .exec();
      if (isGuestCart) {
        return this.updateCartPrices(id);
      }
      return null;
    } catch {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  public async deleteOldCarts(expirationDate: Date): Promise<void> {
    const carts = await this.cartModel
      .find({
        createdAt: { $lt: expirationDate },
        isGuest: true,
      })
      .exec();
    const deviceIds = carts
      .map((cart) => cart.devices)
      .flat()
      .map((id) => id.toString());
    return this.transactionsService.execute<void>(async (session) => {
      await this.cartDevicesService.deleteDevicesFromManyCarts(
        deviceIds,
        session,
      );
      await this.cartModel
        .deleteMany({
          createdAt: { $lt: expirationDate },
          isGuest: true,
        })
        .session(session)
        .exec();
    });
  }
}
