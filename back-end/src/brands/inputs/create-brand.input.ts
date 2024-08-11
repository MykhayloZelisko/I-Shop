import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateBrandInput {
  @Field({ description: 'Category name' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public brandName: string;
}
