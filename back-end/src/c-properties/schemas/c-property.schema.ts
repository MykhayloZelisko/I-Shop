import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CPropertyDocument = HydratedDocument<CProperty>;

@Schema()
export class CProperty {
  @Prop()
  public propertyName: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  public categoryId: string;
}

export const CPropertySchema = SchemaFactory.createForClass(CProperty);