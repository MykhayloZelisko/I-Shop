import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Device } from './device.model';

@ObjectType()
export class DevicesList {
  @Field(() => Int, { description: 'Total number of devices' })
  public total: number;

  @Field(() => Int, { description: 'Page number' })
  public page: number;

  @Field(() => Int, { description: 'Page size' })
  public size: number;

  @Field(() => [Device], { description: 'Part of the devices list' })
  public devices: Device[];
}
