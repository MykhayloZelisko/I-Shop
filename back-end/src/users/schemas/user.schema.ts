import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Role } from '../../roles/schemas/role.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  public first_name: string;

  @Prop()
  public last_name: string;

  @Prop()
  public phone: string;

  @Prop()
  public email: string;

  @Prop()
  public password: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Role' }] })
  public roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
