import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

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

  @Field(() => String, { nullable: true, description: 'Category icon link' })
  public icon: string | null;

  @Field(() => Int, { description: 'Category level' })
  public level: number;

  @Field(() => Boolean, {
    description: 'The presence of a group in a category',
  })
  public hasGroups: boolean;
}
