import { CreateOrderInput } from './create-order.input';
import { InputType, Field, PickType } from '@nestjs/graphql';
import { OrderStatusEnum } from '../../common/enums/order-status.enum';
import { IsEnum } from 'class-validator';

@InputType()
export class UpdateOrderInput extends PickType(CreateOrderInput, []) {
  @Field(() => OrderStatusEnum, {
    description: 'Order status',
  })
  @IsEnum(OrderStatusEnum, { message: 'Invalid order status' })
  public status: OrderStatusEnum;
}
