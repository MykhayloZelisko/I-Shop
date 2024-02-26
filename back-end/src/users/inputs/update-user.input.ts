import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field({ description: 'First name' })
  public firstName: string;

  @Field({ description: 'Last name' })
  public lastName: string;

  @Field({ description: 'Phone number' })
  public phone: string;

  @Field({ description: 'Email' })
  public email: string;

  @Field({ description: 'Password' })
  public password: string;
}
