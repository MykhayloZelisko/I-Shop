import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsMongoId, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateLikeDislikeInput {
  @Field(() => ID, { description: 'Comment ID' })
  @IsMongoId({
    message:
      'String must be a valid hex-encoded representation of a MongoDB ObjectId.',
  })
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public commentId: string;

  @Field(() => Int, { description: 'Like = 1, dislike = -1' })
  @IsIn([-1, 1], { message: 'A value must be 1 or -1' })
  public status: 1 | -1;
}
