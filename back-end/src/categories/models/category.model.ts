import { ObjectType, Field, ID } from '@nestjs/graphql';

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
}
