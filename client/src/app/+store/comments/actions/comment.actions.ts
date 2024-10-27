import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CreateCommentInterface } from '../../../shared/models/interfaces/create-comment.interface';
import { CommentInterface } from '../../../shared/models/interfaces/comment.interface';
import { CommentsListInterface } from '../../../shared/models/interfaces/comments-list.interface';
import { DeletedCommentInterface } from '../../../shared/models/interfaces/deleted-comment.interface';

export const CommentActions = createActionGroup({
  source: 'Comment/API',
  events: {
    // entity actions
    LoadComments: props<{
      deviceId: string;
      cursor: string | null;
      limit: number;
    }>(),
    LoadCommentsSuccess: props<{ comments: CommentsListInterface }>(),
    LoadCommentsFailure: emptyProps(),
    AddComment: props<{ comment: CreateCommentInterface }>(),
    AddCommentSuccess: props<{ comment: CommentInterface }>(),
    AddCommentFailure: emptyProps(),
    UpsertComments: props<{
      deviceId: string;
      cursor: string | null;
      limit: number;
    }>(),
    UpsertCommentsSuccess: props<{ comments: CommentsListInterface }>(),
    UpsertCommentsFailure: emptyProps(),
    UpdateLikes: props<{ commentId: string; status: 1 | -1 }>(),
    UpdateLikesSuccess: props<{ comment: CommentInterface }>(),
    UpdateLikesFailure: emptyProps(),
    UpdateComment: props<{ id: string; comment: CreateCommentInterface }>(),
    UpdateCommentSuccess: props<{ comment: CommentInterface }>(),
    UpdateCommentFailure: emptyProps(),
    DeleteComment: props<{ id: string; cursor: string | null }>(),
    DeleteCommentSuccess: props<{ payload: DeletedCommentInterface }>(),
    DeleteCommentFailure: emptyProps(),
    // other actions
    UpdateCurrentComment: props<{ id: string }>(),
  },
});
