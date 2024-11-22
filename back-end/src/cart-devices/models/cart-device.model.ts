import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';
import { Device } from '../../devices/models/device.model';

@ObjectType()
export class CartDevice {
  @Field(() => ID, { description: 'Unique identifier' })
  public id: string;

  @Field(() => Device, { description: 'Device' })
  public device: Device;

  @Field(() => Int, { description: 'Devices count' })
  public quantity: number;

  @Field(() => Float, { description: 'Device price' })
  public priceAtAdd: number;

  @Field({ description: 'The device is added to the order' })
  public isInOrder: boolean;
}
