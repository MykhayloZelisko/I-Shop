import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from '../../roles/models/role.model';

@ObjectType()
export class User {
  @Field(() => ID, { description: 'Unique identifier' })
  public id: string;

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

  @Field(() => [Role])
  roles: Role[];
}
