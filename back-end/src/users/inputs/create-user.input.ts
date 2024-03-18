import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length, Matches, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field({ description: 'First name' })
  @IsString({ message: 'Must be a string' })
  @MinLength(3, { message: 'Must be more than 3 characters' })
  @Matches(/^([A-Z]{1}[a-z-]+|[А-Я]{1}[а-я-]+)$/, {
    message: 'First name is incorrect',
  })
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public firstName: string;

  @Field({ description: 'Last name' })
  @IsString({ message: 'Must be a string' })
  @MinLength(3, { message: 'Must be more than 3 characters' })
  @Matches(/^([A-Z]{1}[a-z-]+|[А-Я]{1}[а-я-]+)$/, {
    message: 'Last name is incorrect',
  })
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public lastName: string;

  @Field({ description: 'Phone number' })
  @IsString({ message: 'Must be a string' })
  @Length(9, 9, { message: 'Must be 9 characters' })
  @Matches(/^(39|50|63|66|67|68|73|75|77|91|92|93|94|95|96|97|98|99)\d{7}$/, {
    message: 'Phone number is incorrect',
  })
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public phone: string;

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
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}\[\]:;<>,.?\/~_+\-=|\\]).{8,32}$/,
    { message: 'Password is incorrect' },
  )
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public password: string;
}
