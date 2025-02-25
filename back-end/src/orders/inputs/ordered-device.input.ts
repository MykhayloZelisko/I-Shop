import { Field, Float, ID, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

@InputType()
export class OrderedDeviceInput {
  @Field(() => [ID], { description: 'Ordered device id' })
  @IsMongoId({
    message:
      'String must be a valid hex-encoded representation of a MongoDB ObjectId.',
    each: true,
  })
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public device: string;

  @Field(() => Int, { description: 'Device quantity' })
  @IsInt({ message: 'Must be an integer number' })
  @IsPositive({ message: 'Must be a positive number' })
  public quantity: number;

  @Field(() => Float, { description: 'Device price' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Must be a number' })
  @IsPositive({ message: 'Must be a positive number' })
  public priceAtAdd: number;
}
