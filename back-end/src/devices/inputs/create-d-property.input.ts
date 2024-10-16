import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateDPropertyInput {
  @Field({ description: 'Device property name' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public propertyName: string;

  @Field(() => [String], { description: 'Device property values' })
  @IsArray({ message: 'Must be an array' })
  @ArrayNotEmpty({ message: 'Must be not empty array' })
  @IsString({ each: true, message: 'Each value must be a string' })
  @IsNotEmpty({ each: true, message: 'Each string must be not empty' })
  public value: string[];
}
