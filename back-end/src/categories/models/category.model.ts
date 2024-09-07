import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
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

  @Field(() => Int, { description: 'Category level' })
  public level: number;

  @Field(() => [CProperty], { description: 'List of properties' })
  public properties: CProperty[];
}
