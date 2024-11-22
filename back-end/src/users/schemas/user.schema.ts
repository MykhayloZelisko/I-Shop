import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Role } from '../../roles/schemas/role.schema';
import { Cart } from '../../carts/schemas/cart.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  public firstName: string;

  @Prop()
  public lastName: string;

  @Prop()
  public phone: string;

  @Prop()
  public email: string;

  @Prop()
  public password: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Role' }] })
  public roles: Role[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Cart', default: null })
  public cart: Cart | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toObject', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});
