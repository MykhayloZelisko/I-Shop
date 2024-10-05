import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CProperty } from '../../c-properties/models/c-property.model';

@ObjectType()
export class CPropertiesGroup {
  @Field(() => ID, { description: 'Unique identifier' })
  public id: string;

  @Field({ description: 'Properties group name' })
  public groupName: string;

  @Field(() => ID, { description: 'Category id' })
  public categoryId: string;

  @Field(() => [CProperty], {
    description: 'List of properties',
  })
  public properties: CProperty[];
}
