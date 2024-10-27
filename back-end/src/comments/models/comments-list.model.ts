import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Comment } from './comment.model';

@ObjectType()
export class CommentsList {
  @Field(() => ID, {
    nullable: true,
    description: `The last comment's id`,
  })
  public cursor: string | null;

  @Field({ description: 'Check if there are more comments' })
  public hasMore: boolean;

  @Field(() => [Comment], { description: 'Part of the comments list' })
  public comments: Comment[];
}
