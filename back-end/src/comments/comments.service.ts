import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentInput } from './inputs/create-comment.input';
import { UpdateCommentInput } from './inputs/update-comment.input';
import { Comment as CommentGQL } from './models/comment.model';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { Model } from 'mongoose';
import { CommentsList } from './models/comments-list.model';
import { User } from '../users/models/user.model';
import { DeletedComment } from './models/deleted-comment.model';
import { RatingsService } from '../ratings/ratings.service';
import { UpdateLikeDislikeInput } from './inputs/update-like-dislike.input';
import { DevicesService } from '../devices/devices.service';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class CommentsService {
  public constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private ratingsService: RatingsService,
    private devicesService: DevicesService,
  ) {}

  public async createComment(
    createCommentInput: CreateCommentInput,
  ): Promise<CommentGQL> {
    try {
      await this.ratingsService.createRating(
        createCommentInput.userId,
        createCommentInput.deviceId,
        createCommentInput.rating,
      );
      const newComment = await this.commentModel.create({
        content: createCommentInput.content,
        advantages: createCommentInput.advantages,
        disadvantages: createCommentInput.disadvantages,
        rating: createCommentInput.rating,
        device: createCommentInput.deviceId,
        user: createCommentInput.userId,
      });
      await newComment.populate([
        'user',
        'device',
        'likesUsers',
        'dislikesUsers',
      ]);
      return await newComment.toObject();
    } catch {
      throw new ForbiddenException(
        'You cannot add new comment for this device',
      );
    }
  }

  public async getCommentsByDeviceIdAfterCursor(
    deviceId: string,
    cursor: string | null,
    limit: number,
  ): Promise<CommentsList> {
    const query: Record<string, unknown> = { device: deviceId };

    if (cursor) {
      query._id = { $gt: cursor };
    }

    const comments = await this.commentModel
      .find(query)
      .limit(limit + 1)
      .populate(['user', 'device', 'likesUsers', 'dislikesUsers'])
      .exec();

    let hasMore = false;
    if (comments.length > limit) {
      comments.pop();
      hasMore = true;
    }

    return {
      comments: comments.map((comment: CommentDocument) => comment.toObject()),
      hasMore,
      cursor: hasMore ? comments[comments.length - 1].id : null,
    };
  }

  public async updateLikeDislike(
    updateLikeDislikeInput: UpdateLikeDislikeInput,
    user: User,
  ): Promise<CommentGQL> {
    const { commentId, status } = updateLikeDislikeInput;
    const comment = await this.commentModel
      .findById(commentId)
      .populate(['user', 'device', 'likesUsers', 'dislikesUsers'])
      .exec();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    let updatedComment: CommentDocument | null = null;
    if (status === 1) {
      const isLiked = comment.likesUsers.some(
        (likeUser: UserDocument) => likeUser.id.toString() === user.id,
      );

      if (isLiked) {
        updatedComment = await this.commentModel
          .findByIdAndUpdate(
            commentId,
            { $pull: { likesUsers: user.id } },
            { new: true },
          )
          .populate(['user', 'device', 'likesUsers', 'dislikesUsers'])
          .exec();
      } else {
        updatedComment = await this.commentModel
          .findByIdAndUpdate(
            commentId,
            {
              $addToSet: { likesUsers: user.id },
              $pull: { dislikesUsers: user.id },
            },
            { new: true },
          )
          .populate(['user', 'device', 'likesUsers', 'dislikesUsers'])
          .exec();
      }
    } else if (status === -1) {
      const isDisliked = comment.dislikesUsers.some(
        (dislikeUser: UserDocument) => dislikeUser.id.toString() === user.id,
      );

      if (isDisliked) {
        updatedComment = await this.commentModel
          .findByIdAndUpdate(
            commentId,
            { $pull: { dislikesUsers: user.id } },
            { new: true },
          )
          .populate(['user', 'device', 'likesUsers', 'dislikesUsers'])
          .exec();
      } else {
        updatedComment = await this.commentModel
          .findByIdAndUpdate(
            commentId,
            {
              $addToSet: { dislikesUsers: user.id },
              $pull: { likesUsers: user.id },
            },
            { new: true },
          )
          .populate(['user', 'device', 'likesUsers', 'dislikesUsers'])
          .exec();
      }
    }

    if (!updatedComment) {
      throw new BadRequestException('A comment is not updated');
    }

    return updatedComment.toObject();
  }

  public async updateComment(
    id: string,
    updateCommentInput: UpdateCommentInput,
    user: User,
  ): Promise<CommentGQL> {
    const comment = await this.commentModel.findById(id).exec();
    if (!comment) {
      throw new BadRequestException('Comment not found');
    }

    const userId = comment.user.toString();
    const deviceId = comment.device.toString();
    if (userId !== user.id) {
      throw new ForbiddenException('This user cannot update this comment');
    }

    await this.ratingsService.updateRating(
      userId,
      deviceId,
      updateCommentInput.rating,
    );
    const updatedComment = await this.commentModel
      .findByIdAndUpdate(id, updateCommentInput, { new: true })
      .populate(['user', 'device'])
      .exec();
    if (updatedComment) {
      return updatedComment.toObject();
    }
    throw new BadRequestException('A comment is not updated');
  }

  public async deleteComment(
    id: string,
    cursor: string | null,
    user: User,
  ): Promise<DeletedComment> {
    const comment = await this.commentModel.findById(id).exec();
    if (!comment) {
      throw new BadRequestException('Comment not found');
    }

    const isAdmin = user.roles.some((role) => role.role === 'administrator');

    const userId = comment.user.toString();
    const deviceId = comment.device.toString();
    if (userId !== user.id && !isAdmin) {
      throw new ForbiddenException('This user cannot delete this comment');
    }

    await this.commentModel.findByIdAndDelete(id);
    await this.ratingsService.deleteRating(userId, deviceId);

    const updatedDevice = await this.devicesService.getDeviceById(deviceId);

    if (id === cursor) {
      const prevComment = await this.commentModel
        .findOne({
          device: comment.device,
          id: { $lt: comment.id },
        })
        .sort({ id: -1 })
        .exec();
      const newCursor = prevComment ? prevComment.id.toString() : null;
      return { id, cursor: newCursor, device: updatedDevice };
    }

    return { id, cursor, device: updatedDevice };
  }
}
