import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CartDevice, CartDeviceDocument } from './schemas/cart-device.schema';
import { ClientSession, Model } from 'mongoose';
import { CartDevice as CartDeviceGQL } from './models/cart-device.model';
import { CartsService } from '../carts/carts.service';
import { DevicesService } from '../devices/devices.service';
import { DeletedCartDevice } from './models/deleted-cart-device.model';
import { UpdateCartDeviceInput } from './inputs/update-cart-device.input';
import { UpdateCartDevicesInput } from './inputs/update-cart-devices.input';
import { TransactionsService } from '../common/services/transactions/transactions.service';

@Injectable()
export class CartDevicesService {
  public constructor(
    @InjectModel(CartDevice.name)
    private cartDeviceModel: Model<CartDeviceDocument>,
    @Inject(forwardRef(() => CartsService)) private cartsService: CartsService,
    private devicesService: DevicesService,
    private transactionsService: TransactionsService,
  ) {}

  public async createCartDevice(
    id: string,
    session: ClientSession,
  ): Promise<CartDeviceGQL> {
    const device = await this.devicesService.getDeviceById(id);
    const [newDevice] = await this.cartDeviceModel.create(
      [
        {
          device: id,
          priceAtAdd: device.price,
        },
      ],
      { session },
    );
    await newDevice.populate('device');
    return newDevice.toObject<CartDeviceGQL>();
  }

  public async addDeviceToCart(
    id: string, // device id
    cartId: string,
  ): Promise<CartDeviceGQL> {
    return this.transactionsService.execute<CartDeviceGQL>(async (session) => {
      const device = await this.createCartDevice(id, session);
      await this.cartsService.addDeviceToCart(cartId, device.id, session); // cartDevice id
      return device;
    });
  }

  public async updateCartDevice(
    id: string,
    updateDeviceInput: UpdateCartDeviceInput,
  ): Promise<CartDeviceGQL> {
    let updatedDevice: CartDeviceDocument | null = await this.cartDeviceModel
      .findById(id)
      .populate('device')
      .exec();
    if (!updatedDevice) {
      throw new NotFoundException('Device not found');
    }
    if (
      updateDeviceInput.quantity > 0 &&
      updateDeviceInput.quantity <= updatedDevice.device.quantity
    ) {
      updatedDevice = await this.cartDeviceModel
        .findByIdAndUpdate(id, updateDeviceInput, { new: true })
        .populate('device')
        .exec();
    } else {
      throw new BadRequestException('Quantity is incorrect');
    }
    if (!updatedDevice) {
      throw new BadRequestException('Device is not updated');
    }
    return updatedDevice.toObject<CartDeviceGQL>();
  }

  public async updateCartDevices(
    updateCartDevicesInput: UpdateCartDevicesInput,
  ): Promise<boolean> {
    const result = await this.cartDeviceModel
      .updateMany(
        { _id: { $in: updateCartDevicesInput.ids } },
        { $set: { isInOrder: updateCartDevicesInput.isInOrder } },
      )
      .exec();

    if (result.matchedCount === 0) {
      throw new NotFoundException('No devices found with the provided IDs');
    }
    return updateCartDevicesInput.isInOrder;
  }

  public async deleteDevicesFromCart(
    ids: string[],
    cartId: string,
  ): Promise<DeletedCartDevice> {
    return this.transactionsService.execute<DeletedCartDevice>(
      async (session) => {
        await this.cartDeviceModel
          .deleteMany({ _id: { $in: ids } })
          .session(session)
          .exec();
        await this.cartsService.deleteDevicesFromCart(cartId, ids, session);
        const cart = await this.cartsService.getCartById(cartId);
        return {
          ids,
          cart: !cart,
        };
      },
    );
  }

  public async deleteDevicesFromManyCarts(
    ids: string[],
    session: ClientSession,
  ): Promise<void> {
    if (!ids.length) {
      return;
    }
    await this.cartDeviceModel
      .deleteMany({ _id: { $in: ids } })
      .session(session)
      .exec();
  }
}
