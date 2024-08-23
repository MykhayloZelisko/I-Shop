import { CreateDeviceInput } from './create-device.input';
import { InputType, Field, OmitType } from '@nestjs/graphql';
import { CreateDPropertyInput } from './create-d-property.input';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class UpdateDeviceInput extends OmitType(CreateDeviceInput, [
  'properties',
]) {
  @Field(() => [CreateDPropertyInput], {
    description: 'Array of device properties',
  })
  @IsArray({ message: 'Must be an array' })
  @ArrayNotEmpty({ message: 'Must be not empty array' })
  @ValidateNested({ each: true })
  @Type(() => CreateDPropertyInput)
  public properties: CreateDPropertyInput[];
}
