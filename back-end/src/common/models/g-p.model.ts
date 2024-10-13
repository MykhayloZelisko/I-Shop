import { Field, ObjectType } from '@nestjs/graphql';
import { CPropertiesGroup } from '../../c-properties-groups/models/c-properties-group.model';
import { CProperty } from '../../c-properties/models/c-property.model';

@ObjectType()
export class GP {
  @Field(() => [CPropertiesGroup], {
    description: 'Array of properties groups',
  })
  public groups: CPropertiesGroup[];

  @Field(() => [CProperty], { description: 'Array of properties' })
  public properties: CProperty[];
}
