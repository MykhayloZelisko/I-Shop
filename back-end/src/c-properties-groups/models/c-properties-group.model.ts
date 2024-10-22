import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class CPropertiesGroup {
  @Field(() => ID, { description: 'Unique identifier' })
  public id: string;

  @Field({ description: 'Properties group name' })
  public groupName: string;

  @Field(() => ID, { description: 'Category id' })
  public categoryId: string;

  @Field({
    description: 'The presence of a property in a group',
  })
  public hasProperties: boolean;
}
