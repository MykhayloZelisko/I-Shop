import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateDPropertyInput {
  @Field({ description: 'Device property name' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public propertyName: string;

  @Field({ description: 'Device property value' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public value: string;
}
