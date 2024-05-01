import { Field, InputType, PickType } from '@nestjs/graphql';
import { CreateCategoryInput } from './create-category.input';
import { IsBase64 } from 'class-validator';
import { IsImage } from '../../common/validators/is-image.validator';
import { MaxFileSize } from '../../common/validators/max-file-size.validator';

@InputType()
export class UpdateCategoryWithImageFileInput extends PickType(
  CreateCategoryInput,
  ['categoryName'],
) {
  @Field({ description: 'Category picture in base64 string format' })
  @IsBase64(
    { urlSafe: true },
    { message: 'Must be an image file in base64 string format' },
  )
  @IsImage()
  @MaxFileSize(1024 * 1024)
  public image: string;
}
