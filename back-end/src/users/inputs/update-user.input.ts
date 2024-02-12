import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field({ description: 'First name' })
  public first_name: string;

  @Field({ description: 'Last name' })
  public last_name: string;

  @Field({ description: 'Phone number' })
  public phone: string;

  @Field({ description: 'Email' })
  public email: string;

  @Field({ description: 'Password' })
  public password: string;
}
