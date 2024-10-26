import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  ID,
  Context,
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
import { Device } from '../devices/models/device.model';
import { ParseObjectIdNullablePipe } from '../common/pipes/parse-object-id-nullable/parse-object-id-nullable.pipe';
import { UpdateLikeDislikeInput } from './inputs/update-like-dislike.input';

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
    @Args('deviceId', { type: () => ID }, ParseObjectIdPipe) deviceId: string,
    @Args(
      'cursor',
      { type: () => ID, nullable: true },
      ParseObjectIdNullablePipe,
    )
    cursor: string | null,
    @Args('limit', { type: () => Int }, ParseIntegerPipe) limit: number,
  ): Promise<CommentsList> {
    return this.commentsService.getCommentsByDeviceIdAfterCursor(
      deviceId,
      cursor,
      limit,
    );
  }

  @Mutation(() => Comment)
  @UseGuards(GqlAuthGuard)
  public async updateLikeDislike(
    @Args('updateLikeDislikeInput', ValidationPipe)
    updateLikeDislikeInput: UpdateLikeDislikeInput,
    @Context() context: { req: { user: User } },
  ): Promise<Comment> {
    return this.commentsService.updateLikeDislike(
      updateLikeDislikeInput,
      context.req.user,
    );
  }

  @Mutation(() => Comment)
  @UseGuards(GqlAuthGuard)
  public async updateComment(
    @Args('id', { type: () => ID }, ParseObjectIdPipe) id: string,
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
  public async deleteComment(
    @Args('id', { type: () => ID }, ParseObjectIdPipe) id: string,
    @Args(
      'cursor',
      { type: () => ID, nullable: true },
      ParseObjectIdNullablePipe,
    )
    cursor: string | null,
    @Context() context: { req: { user: User } },
  ): Promise<DeletedComment> {
    return this.commentsService.deleteComment(id, cursor, context.req.user);
  }

  @ResolveField(() => User)
  public async user(@Parent() comment: Comment): Promise<User> {
    return comment.user;
  }

  @ResolveField(() => Device)
  public async device(@Parent() comment: Comment): Promise<Device> {
    return comment.device;
  }

  @ResolveField(() => [User])
  public async likesUsers(@Parent() comment: Comment): Promise<User[]> {
    return comment.likesUsers;
  }

  @ResolveField(() => [User])
  public async dislikesUsers(@Parent() comment: Comment): Promise<User[]> {
    return comment.dislikesUsers;
  }
}
