import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ type: MongooseSchema.Types.ObjectId })
  public deviceId: string;
  @Prop()
  public rating: number;

  @Prop()
  public advantages: string;

  @Prop()
  public disadvantages: string;

  @Prop()
  public comment: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  public user: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.set('toObject', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});
