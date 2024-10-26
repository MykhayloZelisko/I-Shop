import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Device } from '../../devices/models/device.model';

@ObjectType()
export class DeletedComment {
  @Field(() => ID, { description: 'Unique identifier' })
  public id: string;

  @Field(() => ID, { nullable: true, description: 'Cursor for pagination' })
  public cursor: string | null;

  @Field(() => Device, { description: 'Device' })
  public device: Device;
}
