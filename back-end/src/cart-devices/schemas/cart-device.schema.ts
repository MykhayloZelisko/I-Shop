import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Device } from '../../devices/schemas/device.schema';

export type CartDeviceDocument = HydratedDocument<CartDevice>;

@Schema()
export class CartDevice {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Device' })
  public device: Device;

  @Prop({ default: 1 })
  public quantity: number;

  @Prop()
  public priceAtAdd: number;

  @Prop({ default: true })
  public isInOrder: boolean;
}

export const CartDeviceSchema = SchemaFactory.createForClass(CartDevice);

CartDeviceSchema.set('toObject', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});
