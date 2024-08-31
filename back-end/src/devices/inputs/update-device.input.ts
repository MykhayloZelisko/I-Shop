import { CreateDeviceInput } from './create-device.input';
import { InputType, Field, OmitType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateDPropertyInput } from './update-d-property.input';

@InputType()
export class UpdateDeviceInput extends OmitType(CreateDeviceInput, [
  'properties',
]) {
  @Field(() => [UpdateDPropertyInput], {
    description: 'Array of device properties',
  })
  @IsArray({ message: 'Must be an array' })
  @ArrayNotEmpty({ message: 'Must be not empty array' })
  @ValidateNested({ each: true })
  @Type(() => UpdateDPropertyInput)
  public properties: UpdateDPropertyInput[];
}
