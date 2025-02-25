import { ObjectType, Field, Float } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';
import { OrderStatusEnum } from '../../common/enums/order-status.enum';
import { OrderedDevice } from './ordered-device.model';

@ObjectType()
export class Order {
  @Field(() => User, { description: 'User' })
  public user: User;

  @Field(() => [OrderedDevice], { description: 'Array of ordered devices' })
  public devices: OrderedDevice[];

  @Field(() => Float, { description: 'total price' })
  public totalPrice: number;

  @Field(() => OrderStatusEnum, {
    description: 'Order status',
  })
  public status: OrderStatusEnum;
}
