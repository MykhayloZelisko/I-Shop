import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field({ description: 'First name' })
  first_name: string;

  @Field({ description: 'Last name' })
  last_name: string;

  @Field({ description: 'Phone number' })
  phone: string;

  @Field({ description: 'Email' })
  email: string;

  @Field({ description: 'Password' })
  password: string;
}
