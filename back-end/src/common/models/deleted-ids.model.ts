import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeletedIds {
  @Field(() => [ID], { description: 'Categories identifiers' })
  public categoriesIds: string[];

  @Field(() => [ID], { description: 'Groups identifiers' })
  public groupsIds: string[];

  @Field(() => [ID], { description: 'Properties identifiers' })
  public propertiesIds: string[];
}
