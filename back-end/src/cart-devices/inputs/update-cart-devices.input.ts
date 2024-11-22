import { Field, ID, InputType } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';

@InputType()
export class UpdateCartDevicesInput {
  @Field(() => [ID], { description: 'Devices ids' })
  @IsArray({ message: 'Must be an array' })
  @ArrayNotEmpty({ message: 'Must be not empty array' })
  @IsMongoId({
    message:
      'String must be a valid hex-encoded representation of a MongoDB ObjectId.',
    each: true,
  })
  @IsNotEmpty({ message: 'Must be a not empty string', each: true })
  public ids: string[];

  @Field({ description: 'Is the device added into the order?' })
  @IsBoolean({ message: 'Value should be boolean' })
  public isInOrder: boolean;
}
