import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { OrderStatusEnum } from '../../common/enums/order-status.enum';
import { OrderedDevice } from './ordered-device.schema';
import { Recipient } from './recipient.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  public user: User;

  @Prop({ type: [OrderedDevice] })
  public devices: OrderedDevice[];

  @Prop()
  public totalPrice: number;

  @Prop({
    type: String,
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PendingConfirmation,
  })
  public status: OrderStatusEnum;

  @Prop({ type: Recipient })
  public recipient: Recipient;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.set('toObject', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});
