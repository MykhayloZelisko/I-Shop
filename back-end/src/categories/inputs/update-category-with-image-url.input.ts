import { Field, InputType, PickType } from '@nestjs/graphql';
import { CreateCategoryInput } from './create-category.input';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateCategoryWithImageUrlInput extends PickType(
  CreateCategoryInput,
  ['categoryName'],
) {
  @Field(() => String, {
    nullable: true,
    description: 'Category picture url',
  })
  @IsOptional()
  @IsString({ message: 'Must be a string' })
  public image: string | null;
}
