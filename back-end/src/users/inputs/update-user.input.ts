import { CreateUserInput } from './create-user.input';
import { Field, InputType, OmitType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateUserInput extends OmitType(CreateUserInput, []) {
  @Field({ description: 'Patronymic name' })
  @IsString({ message: 'Must be a string' })
  @IsOptional()
  public patronymic: string;
}
