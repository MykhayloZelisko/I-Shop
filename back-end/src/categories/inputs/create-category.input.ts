import { InputType, Field, ID, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

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

  @Field(() => Int, { description: 'Parent category id', nullable: true })
  @IsNumber(undefined, { message: 'Must be a number' })
  @IsInt({ message: 'Must be an integer number' })
  @Min(1, { message: 'Value must be greater than 1' })
  public level: number;
}
