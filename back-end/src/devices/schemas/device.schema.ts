import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';
import { Brand } from '../../brands/schemas/brand.schema';
import { DProperty } from './d-property.schema';

export type DeviceDocument = HydratedDocument<Device>;

@Schema()
export class Device {
  @Prop()
  public deviceName: string;

  @Prop()
  public price: number;

  @Prop({ default: 0 })
  public rating: number;

  @Prop({ default: 0 })
  public votes: number;

  @Prop({ type: [String] })
  public images: string[];

  @Prop({ type: { type: MongooseSchema.Types.ObjectId, ref: 'Category' } })
  public category: Category;

  @Prop({ type: { type: MongooseSchema.Types.ObjectId, ref: 'Brand' } })
  public brand: Brand;

  @Prop({ type: [DProperty] })
  public properties: DProperty[];
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
