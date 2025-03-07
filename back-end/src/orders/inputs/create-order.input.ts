import { InputType, Field, Float } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { OrderedDeviceInput } from './ordered-device.input';
import { Type } from 'class-transformer';
import { RecipientInput } from './recipient.input';

@InputType()
export class CreateOrderInput {
  @Field(() => [OrderedDeviceInput], {
    description: 'Array of ordered devices',
  })
  @IsArray({ message: 'Must be an array' })
  @ArrayNotEmpty({ message: 'Must be not empty array' })
  @ValidateNested({ each: true })
  @Type(() => OrderedDeviceInput)
  public devices: OrderedDeviceInput[];

  @Field(() => Float, { description: 'total price' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Must be a number' })
  @IsPositive({ message: 'Must be a positive number' })
  public totalPrice: number;

  @Field(() => RecipientInput, {
    description: 'Recipient of an order',
  })
  @ValidateNested()
  @Type(() => RecipientInput)
  public recipient: RecipientInput;
}
