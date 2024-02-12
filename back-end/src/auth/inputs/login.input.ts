import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field({ description: 'Email' })
  email: string;

  @Field({ description: 'Password' })
  password: string;
}
