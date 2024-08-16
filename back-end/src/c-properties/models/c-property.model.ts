import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class CProperty {
  @Field(() => ID, { description: 'Unique identifier' })
  public id: string;

  @Field({ description: 'Property name' })
  public propertyName: string;

  @Field(() => ID, { description: 'Category id' })
  public categoryId: string;
}
