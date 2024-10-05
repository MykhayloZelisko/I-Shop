import { Field, InputType } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateDPropertyInput } from './create-d-property.input';
import { Type } from 'class-transformer';

@InputType()
export class CreateDPropertiesGroupInput {
  @Field({ description: 'Device properties group name' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public groupName: string;

  @Field(() => [CreateDPropertyInput], {
    description: 'Array of device properties',
  })
  @IsArray({ message: 'Must be an array' })
  @ArrayNotEmpty({ message: 'Must be not empty array' })
  @ValidateNested({ each: true })
  @Type(() => CreateDPropertyInput)
  public properties: CreateDPropertyInput[];
}
