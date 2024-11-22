import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from '../../roles/models/role.model';
import { Cart } from '../../carts/models/cart.model';

@ObjectType()
export class User {
  @Field(() => ID, { description: 'Unique identifier' })
  public id: string;

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

  @Field(() => [Role], { description: 'List of roles' })
  public roles: Role[];

  @Field(() => Cart, { description: 'Cart', nullable: true })
  public cart: Cart | null;
}
