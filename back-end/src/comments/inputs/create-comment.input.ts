import { InputType, Field, ID, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field(() => ID, { description: 'Device ID' })
  @IsMongoId({
    message:
      'String must be a valid hex-encoded representation of a MongoDB ObjectId.',
  })
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public deviceId: string;

  @Field(() => ID, { description: 'User ID' })
  @IsMongoId({
    message:
      'String must be a valid hex-encoded representation of a MongoDB ObjectId.',
  })
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public userId: string;

  @Field(() => Int, { description: 'Device rate' })
  @IsInt({ message: 'Must be an integer number' })
  @IsPositive({ message: 'Must be a positive number' })
  @Max(5, { message: 'Must not be greater than 5' })
  public rating: number;

  @Field({ description: `Device's advantages` })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public advantages: string;

  @Field({ description: `Device's disadvantages` })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public disadvantages: string;

  @Field({ description: `Comment's content` })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public content: string;
}
