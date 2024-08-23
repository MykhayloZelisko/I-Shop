import { InputType, Field, Float } from '@nestjs/graphql';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinLength, ValidateNested,
} from 'class-validator';
import { IsBase64 } from '../../common/validators/is-base64.validator';
import { IsImage } from '../../common/validators/is-image.validator';
import { MaxFileSize } from '../../common/validators/max-file-size.validator';
import { CreateDPropertyInput } from './create-d-property.input';
import { Type } from 'class-transformer';

@InputType()
export class CreateDeviceInput {
  @Field({ description: 'Device name' })
  @IsString({ message: 'Must be a string' })
  @MinLength(3, { message: 'Must be more than 3 characters' })
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public deviceName: string;

  @Field(() => Float, { description: 'Device price' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Must be an integer number' })
  @IsPositive({ message: 'Must be a positive number' })
  public price: number;

  @Field(() => [String], { description: 'Device pictures links' })
  @IsArray({ message: 'Must be an array' })
  @ArrayNotEmpty({ message: 'Must be not empty array' })
  @ArrayMaxSize(5, { message: 'Array must contain not more than 5 items' })
  @IsBase64({ each: true })
  @IsImage({ each: true })
  @MaxFileSize(1024 * 1024, { each: true })
  public images: string[];

  @Field({ description: 'Device category' })
  @IsMongoId({
    message:
      'String must be a valid hex-encoded representation of a MongoDB ObjectId.',
  })
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public categoryId: string;

  @Field({ description: 'Device brand' })
  @IsMongoId({
    message:
      'String must be a valid hex-encoded representation of a MongoDB ObjectId.',
  })
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public brandId: string;

  @Field(() => [CreateDPropertyInput], {
    description: 'Array of device properties',
  })
  @IsArray({ message: 'Must be an array' })
  @ArrayNotEmpty({ message: 'Must be not empty array' })
  @ValidateNested({ each: true })
  @Type(() => CreateDPropertyInput)
  public properties: CreateDPropertyInput[];
}
