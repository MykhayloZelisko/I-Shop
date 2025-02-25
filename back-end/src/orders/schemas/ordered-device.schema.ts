import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Device } from '../../devices/schemas/device.schema';

@Schema({ _id: false })
export class OrderedDevice {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Device' })
  public device: Device;

  @Prop({ default: 1 })
  public quantity: number;

  @Prop()
  public priceAtAdd: number;
}
