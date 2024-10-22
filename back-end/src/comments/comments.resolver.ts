import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  ID, Context,
} from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from './models/comment.model';
import { CreateCommentInput } from './inputs/create-comment.input';
import { UpdateCommentInput } from './inputs/update-comment.input';
import { User } from '../users/models/user.model';
import { UseGuards, UsePipes } from '@nestjs/common';
import { ValidationPipe } from '../common/pipes/validation/validation.pipe';
import { GqlAuthGuard } from '../common/guards/gql-auth/gql-auth.guard';
import { CommentsList } from './models/comments-list.model';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id/parse-object-id.pipe';
import { ParseIntegerPipe } from '../common/pipes/parse-integer/parse-integer.pipe';
import { DeletedComment } from './models/deleted-comment.model';

@Resolver(() => Comment)
export class CommentsResolver {
  public constructor(private commentsService: CommentsService) {}

  @Mutation(() => Comment)
  @UsePipes(ValidationPipe)
  @UseGuards(GqlAuthGuard)
  public async createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ): Promise<Comment> {
    return this.commentsService.createComment(createCommentInput);
  }

  @Query(() => CommentsList, { name: 'comments' })
  public async getCommentsByDeviceIdAfterCursor(
    @Args('deviceId', ParseObjectIdPipe) deviceId: string,
    @Args('after', { type: () => ID, nullable: true }, ParseObjectIdPipe)
    after: string | null,
    @Args('limit', { type: () => Int }, ParseIntegerPipe) limit: number,
  ): Promise<CommentsList> {
    return this.commentsService.getCommentsByDeviceIdAfterCursor(
      deviceId,
      after,
      limit,
    );
  }

  @Mutation(() => Comment)
  @UseGuards(GqlAuthGuard)
  public async updateComment(
    @Args('id', ParseObjectIdPipe) id: string,
    @Args('updateCommentInput', ValidationPipe)
    updateCommentInput: UpdateCommentInput,
    @Context() context: { req: { user: User } },
  ): Promise<Comment> {
    return this.commentsService.updateComment(
      id,
      updateCommentInput,
      context.req.user,
    );
  }

  @Mutation(() => DeletedComment)
  @UseGuards(GqlAuthGuard)
  public async removeComment(
    @Args('id', ParseObjectIdPipe) id: string,
    @Args('cursor', ParseObjectIdPipe) cursor: string,
    @Context() context: { req: { user: User } },
  ): Promise<DeletedComment> {
    return this.commentsService.deleteComment(id, cursor, context.req.user);
  }

  @ResolveField(() => User)
  public async user(@Parent() comment: Comment): Promise<User> {
    return comment.user;
  }
}
