import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Role {
  @Field(() => ID, { description: 'Unique identifier' })
  public id: string;

  @Field({ description: 'Role name' })
  public role: string;
}
