import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CProperty } from '../../c-properties/models/c-property.model';

@ObjectType()
export class Category {
  @Field(() => ID, { description: 'Unique identifier' })
  public id: string;

  @Field({ description: 'Category name' })
  public categoryName: string;

  @Field(() => ID, { description: 'Parent category id', nullable: true })
  public parentId: string | null;

  @Field(() => String, { description: 'Category picture link', nullable: true })
  public image: string | null;

  @Field(() => [CProperty], { description: 'List of properties' })
  public properties: CProperty[];
}
