import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CommentActions } from '../actions/comment.actions';
import { CommentInterface } from '../../../shared/models/interfaces/comment.interface';
import { UpdateStr } from '@ngrx/entity/src/models';

export const commentsFeatureKey = 'comments';

export interface State extends EntityState<CommentInterface> {
  cursor: string | null;
  hasMore: boolean;
  currentComment: string | null;
}

export const adapter: EntityAdapter<CommentInterface> =
  createEntityAdapter<CommentInterface>({
    sortComparer: (a: CommentInterface, b: CommentInterface): number =>
      a.id.localeCompare(b.id),
  });

export const initialState: State = adapter.getInitialState({
  cursor: null,
  hasMore: true,
  currentComment: null,
});

export const reducer = createReducer(
  initialState,
  // entity actions
  on(CommentActions.addCommentSuccess, (state, action) =>
    adapter.addOne(action.comment, state),
  ),
  on(CommentActions.upsertCommentsSuccess, (state, action) => {
    const updatedState = adapter.upsertMany(action.comments.comments, state);
    return {
      ...state,
      ...updatedState,
      cursor: action.comments.cursor,
      hasMore: action.comments.hasMore,
    };
  }),
  on(CommentActions.updateCommentSuccess, (state, action) => {
    const update: UpdateStr<CommentInterface> = {
      id: action.comment.id,
      changes: {
        content: action.comment.content,
        advantages: action.comment.advantages,
        disadvantages: action.comment.disadvantages,
        rating: action.comment.rating,
        updatedAt: action.comment.updatedAt,
        device: action.comment.device,
      },
    };
    return adapter.updateOne(update, state);
  }),
  on(CommentActions.deleteCommentSuccess, (state, action) => {
    const updatedState = adapter.removeOne(action.payload.id, state);
    return {
      ...state,
      ...updatedState,
      cursor: action.payload.cursor,
    };
  }),
  on(CommentActions.loadCommentsSuccess, (state, action) => {
    const updatedState = adapter.setAll(action.comments.comments, state);
    return {
      ...state,
      ...updatedState,
      cursor: action.comments.cursor,
      hasMore: action.comments.hasMore,
    };
  }),
  on(CommentActions.updateLikesSuccess, (state, action) => {
    const update: UpdateStr<CommentInterface> = {
      id: action.comment.id,
      changes: {
        likesUsers: [...action.comment.likesUsers],
        dislikesUsers: [...action.comment.dislikesUsers],
      },
    };
    return adapter.updateOne(update, state);
  }),
  // other actions
  on(CommentActions.updateCurrentComment, (state, action) => ({
    ...state,
    currentComment: action.id,
  })),
);
