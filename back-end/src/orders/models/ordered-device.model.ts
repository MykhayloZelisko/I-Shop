import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Device } from '../../devices/models/device.model';

@ObjectType()
export class OrderedDevice {
  @Field(() => Device, { description: 'Device' })
  public device: Device;

  @Field(() => Int, { description: 'Devices count' })
  public quantity: number;

  @Field(() => Float, { description: 'Device price' })
  public priceAtAdd: number;
}
