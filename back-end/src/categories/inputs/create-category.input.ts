import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@InputType()
export class CreateCategoryInput {
  @Field({ description: 'Category name' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public categoryName: string;

  @Field(() => ID, { description: 'Parent category id', nullable: true })
  @IsString({ message: 'Must be a string' })
  @Matches(/^[0-9a-fA-F]{24}$/)
  @IsOptional()
  public parentId: string | null;

  @Field(() => GraphQLUpload, {
    nullable: true,
    description: 'Category picture',
  })
  @IsOptional()
  public image: Promise<FileUpload> | null;
}
