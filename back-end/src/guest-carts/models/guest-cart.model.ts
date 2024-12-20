import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CartDevice } from '../../cart-devices/models/cart-device.model';

@ObjectType()
export class GuestCart {
  @Field(() => ID, { description: 'Unique identifier' })
  public id: string;

  @Field(() => [CartDevice], { description: 'Device list' })
  public devices: CartDevice[];
}
