import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderInput } from './inputs/create-order.input';
import { UpdateOrderInput } from './inputs/update-order.input';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Model, RootFilterQuery } from 'mongoose';
import { Order as OrderGQL } from './models/order.model';
import { User } from '../users/models/user.model';

@Injectable()
export class OrdersService {
  public constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  public async createOrder(
    createOrderInput: CreateOrderInput,
    user: User,
  ): Promise<OrderGQL> {
    const order = await this.orderModel.create({
      ...createOrderInput,
      user: user.id,
    });
    await order.populate([
      { path: 'user' },
      {
        path: 'devices',
        populate: { path: 'device' },
      },
    ]);

    return order.toObject<OrderGQL>();
  }

  public async getAllOrders(
    filterParams: RootFilterQuery<OrderDocument>,
  ): Promise<OrderGQL[]> {
    const orders = await this.orderModel
      .find(filterParams)
      .populate([
        { path: 'user' },
        {
          path: 'devices',
          populate: { path: 'device' },
        },
      ])
      .exec();
    return orders.map((order: OrderDocument) => order.toObject<OrderGQL>());
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} order`;
  // }

  public async updateOrder(
    id: string,
    updateOrderInput: UpdateOrderInput,
  ): Promise<OrderGQL> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderInput)
      .populate([
        { path: 'user' },
        {
          path: 'devices',
          populate: { path: 'device' },
        },
      ])
      .exec();

    if (updatedOrder) {
      return updatedOrder.toObject<OrderGQL>();
    }

    throw new BadRequestException('An order is not updated');
  }

  // remove(id: number) {
  //   return `This action removes a #${id} order`;
  // }
}
