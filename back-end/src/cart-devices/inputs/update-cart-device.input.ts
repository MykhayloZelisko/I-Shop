import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsPositive } from 'class-validator';

@InputType()
export class UpdateCartDeviceInput {
  @Field(() => Int, { description: 'Device quantity' })
  @IsInt({ message: 'Must be an integer number' })
  @IsPositive({ message: 'Must be a positive number' })
  public quantity: number;

  @Field({ description: 'Is the device added into the order?' })
  @IsBoolean({ message: 'Value should be boolean' })
  public isInOrder: boolean;
}
