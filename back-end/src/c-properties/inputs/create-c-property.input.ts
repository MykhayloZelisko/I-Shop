import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

@InputType()
export class CreateCPropertyInput {
  @Field({ description: 'Property name' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public propertyName: string;

  @Field(() => ID, { description: 'Category id' })
  @IsString({ message: 'Must be a string' })
  @Matches(/^[0-9a-fA-F]{24}$/, { message: 'Parent id is incorrect' })
  public categoryId: string;
}
