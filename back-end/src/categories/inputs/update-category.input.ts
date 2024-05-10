import { Field, InputType, PickType } from '@nestjs/graphql';
import { CreateCategoryInput } from './create-category.input';
import { IsOptional } from 'class-validator';
import { IsImage } from '../../common/validators/is-image.validator';
import { MaxFileSize } from '../../common/validators/max-file-size.validator';
import { IsBase64 } from '../../common/validators/is-base64.validator';

@InputType()
export class UpdateCategoryInput extends PickType(CreateCategoryInput, [
  'categoryName',
]) {
  @Field(() => String, {
    nullable: true,
    description: 'Category picture in base64 string format',
  })
  @IsOptional()
  @IsBase64()
  @IsImage()
  @MaxFileSize(1024 * 1024)
  public image: string | null;
}
