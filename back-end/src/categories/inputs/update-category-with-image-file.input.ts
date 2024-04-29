import { Field, InputType, PickType } from '@nestjs/graphql';
import { CreateCategoryInput } from './create-category.input';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { ValidatePromise } from 'class-validator';

@InputType()
export class UpdateCategoryWithImageFileInput extends PickType(
  CreateCategoryInput,
  ['categoryName'],
) {
  @Field(() => GraphQLUpload, { description: 'Category picture file' })
  @ValidatePromise({ message: 'Must be an image file' })
  public image: Promise<FileUpload>;
}
