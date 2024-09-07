import { InputType, Field, ID, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsOptional, IsPositive,
  IsString,
  Matches, Max,
  ValidateIf,
} from 'class-validator';
import { IsImage } from '../../common/validators/is-image.validator';
import { MaxFileSize } from '../../common/validators/max-file-size.validator';
import { IsBase64 } from '../../common/validators/is-base64.validator';

@InputType()
export class CreateCategoryInput {
  @Field({ description: 'Category name' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public categoryName: string;

  @Field(() => ID, { description: 'Parent category id', nullable: true })
  @IsString({ message: 'Must be a string' })
  @Matches(/^[0-9a-fA-F]{24}$/, { message: 'Parent id is incorrect' })
  @ValidateIf((object) => object.parentId !== null && object.image !== null, {
    message: 'ParentId and image must be both present or both absent',
  })
  @IsOptional()
  public parentId: string | null;

  @Field(() => String, {
    nullable: true,
    description: 'Category picture in base64 string format',
  })
  @IsOptional()
  @IsBase64()
  @ValidateIf((object) => object.parentId !== null && object.image !== null, {
    message: 'ParentId and image must be both present or both absent',
  })
  @IsImage()
  @MaxFileSize(1024 * 1024)
  public image: string | null;

  @Field(() => Int, { description: 'Category level' })
  @IsInt({ message: 'Must be an integer number' })
  @IsPositive({ message: 'Must be a positive number' })
  @Max(3, { message: 'Must not be greater than 3' })
  public level: number;
}
