import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CProperty } from '../../c-properties/schemas/c-property.schema';

export type CPropertiesGroupDocument = HydratedDocument<CPropertiesGroup>;

@Schema()
export class CPropertiesGroup {
  @Prop()
  public groupName: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  public categoryId: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'CProperty' }] })
  public properties: CProperty[];
}

export const CPropertiesGroupSchema =
  SchemaFactory.createForClass(CPropertiesGroup);

CPropertiesGroupSchema.set('toObject', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});
