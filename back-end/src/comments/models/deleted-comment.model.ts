import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeletedComment {
  @Field(() => ID, { description: 'Unique identifier' })
  public id: string;

  @Field(() => ID, { description: 'Cursor for pagination' })
  public cursor: string;
}
