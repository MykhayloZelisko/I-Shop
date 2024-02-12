import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from '../../roles/models/role.model';

@ObjectType()
export class User {
  @Field(() => ID, { description: 'Unique identifier' })
  public id: string;

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

  @Field(() => [Role])
  public roles: Role[];
}
