import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { CreateCommentInterface } from '../../../shared/models/interfaces/create-comment.interface';
import { CommentInterface } from '../../../shared/models/interfaces/comment.interface';

export const CommentActions = createActionGroup({
  source: 'Comment/API',
  events: {
    // 'Load Comments': props<{ comments: Comment[] }>(),
    AddComment: props<{ comment: CreateCommentInterface }>(),
    AddCommentSuccess: props<{ comment: CommentInterface }>(),
    AddCommentFailure: emptyProps(),
    // 'Upsert Comment': props<{ comment: Comment }>(),
    // 'Add Comments': props<{ comments: Comment[] }>(),
    // 'Upsert Comments': props<{ comments: Comment[] }>(),
    // 'Update Comment': props<{ comment: Update<Comment> }>(),
    // 'Update Comments': props<{ comments: Update<Comment>[] }>(),
    // 'Delete Comment': props<{ id: string }>(),
    // 'Delete Comments': props<{ ids: string[] }>(),
    // 'Clear Comments': emptyProps(),
  },
});
