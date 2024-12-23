import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { CartDevice } from '../../cart-devices/schemas/cart-device.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema()
export class Cart {
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'CartDevice' }],
  })
  public devices: CartDevice[];

  @Prop({
    type: Date,
    default: () => new Date(),
  })
  public createdAt: Date;

  @Prop()
  public isGuest: boolean;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.set('toObject', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});
