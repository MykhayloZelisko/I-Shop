import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CPropertiesGroupDocument = HydratedDocument<CPropertiesGroup>;

@Schema()
export class CPropertiesGroup {
  @Prop()
  public groupName: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  public categoryId: string;
}

export const CPropertiesGroupSchema =
  SchemaFactory.createForClass(CPropertiesGroup);

CPropertiesGroupSchema.index({ categoryId: 1, groupName: 1 }, { unique: true });

CPropertiesGroupSchema.set('toObject', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});
