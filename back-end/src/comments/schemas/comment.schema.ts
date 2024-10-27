import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Device } from '../../devices/schemas/device.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Device' })
  public device: Device;

  @Prop()
  public rating: number;

  @Prop()
  public advantages: string;

  @Prop()
  public disadvantages: string;

  @Prop()
  public content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  public user: User;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  public likesUsers: User[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  public dislikesUsers: User[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.set('toObject', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});
