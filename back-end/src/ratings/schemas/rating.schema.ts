import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type RatingDocument = HydratedDocument<Rating>;

@Schema()
export class Rating {
  @Prop({ type: MongooseSchema.Types.ObjectId })
  public deviceId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  public userId: string;

  @Prop()
  public rate: number;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);

RatingSchema.set('toObject', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});
