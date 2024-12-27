import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

@InputType()
export class LoginInput {
  @Field({ description: 'Email' })
  @IsString({ message: 'Must be a string' })
  @Matches(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    { message: 'Email is incorrect' },
  )
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public email: string;

  @Field({ description: 'Password' })
  @IsString({ message: 'Must be a string' })
  @Length(8, 32, { message: 'Must be between 8 and 32 characters' })
  @Matches(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,?/~_+\-=|\\]).{8,32}$/,
    { message: 'Password is incorrect' },
  )
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public password: string;
}
