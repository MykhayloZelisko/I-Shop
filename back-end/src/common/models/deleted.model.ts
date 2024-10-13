import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CPropertiesGroup } from '../../c-properties-groups/models/c-properties-group.model';
import { Category } from '../../categories/models/category.model';

@ObjectType()
export class Deleted {
  @Field(() => [ID], { description: 'Categories identifiers' })
  public categoriesIds: string[];

  @Field(() => [ID], { description: 'Groups identifiers' })
  public groupsIds: string[];

  @Field(() => [ID], { description: 'Properties identifiers' })
  public propertiesIds: string[];

  @Field(() => CPropertiesGroup, {
    nullable: true,
    description: 'Parent group if applicable',
  })
  public group: CPropertiesGroup | null;

  @Field(() => Category, {
    nullable: true,
    description: 'Parent category if applicable',
  })
  public category: Category | null;
}
