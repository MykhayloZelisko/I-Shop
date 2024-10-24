import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { CreateCommentInterface } from '../../../shared/models/interfaces/create-comment.interface';
import { CommentInterface } from '../../../shared/models/interfaces/comment.interface';
import { CommentsListInterface } from '../../../shared/models/interfaces/comments-list.interface';

export const CommentActions = createActionGroup({
  source: 'Comment/API',
  events: {
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
    // 'Upsert Comment': props<{ comment: Comment }>(),
    // AddComments: props<{ comments: Comment[] }>(),
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
    // 'Update Comment': props<{ comment: Update<Comment> }>(),
    // 'Update Comments': props<{ comments: Update<Comment>[] }>(),
    // 'Delete Comment': props<{ id: string }>(),
    // 'Delete Comments': props<{ ids: string[] }>(),
    // 'Clear Comments': emptyProps(),
  },
});
