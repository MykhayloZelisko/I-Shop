import { CreateCategoryInput } from './create-category.input';
import { InputType, OmitType } from '@nestjs/graphql';

@InputType()
export class UpdateCategoryInput extends OmitType(CreateCategoryInput, [
  'parentId',
]) {}
