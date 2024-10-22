import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';
import { Device } from '../../devices/models/device.model';

@ObjectType()
export class Comment {
  @Field(() => ID, { description: 'Unique identifier' })
  public id: string;

  @Field(() => Int, { description: 'Device rate' })
  public rating: number;

  @Field({ description: `Device's advantages` })
  public advantages: string;

  @Field({ description: `Device's disadvantages` })
  public disadvantages: string;

  @Field({ description: `Comment's content` })
  public comment: string;

  @Field(() => User, { description: `Comment's author` })
  public user: User;

  @Field(() => Device, { description: 'Device' })
  public device: Device;
}
