import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field({ description: 'Email' })
  public email: string;

  @Field({ description: 'Password' })
  public password: string;
}
