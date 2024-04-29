import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
  ValidatePromise,
} from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

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

  @Field(() => GraphQLUpload, {
    nullable: true,
    description: 'Category picture',
  })
  @IsOptional()
  @ValidatePromise()
  @ValidateIf((object) => object.parentId !== null && object.image !== null, {
    message: 'ParentId and image must be both present or both absent',
  })
  public image: Promise<FileUpload> | null;
}
