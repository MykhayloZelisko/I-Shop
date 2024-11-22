import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';
import { Brand } from '../../brands/schemas/brand.schema';
import { DPropertiesGroup } from './d-properties-group.schema';

export type DeviceDocument = HydratedDocument<Device>;

@Schema()
export class Device {
  @Prop()
  public deviceName: string;

  @Prop()
  public price: number;

  @Prop()
  public quantity: number;

  @Prop({ default: 0 })
  public rating: number;

  @Prop({ default: 0 })
  public votes: number;

  @Prop({ type: [String] })
  public images: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  public category: Category;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Category' }] })
  public categories: Category[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Brand' })
  public brand: Brand;

  @Prop({ type: [DPropertiesGroup] })
  public groups: DPropertiesGroup[];
}

export const DeviceSchema = SchemaFactory.createForClass(Device);

DeviceSchema.set('toObject', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});
