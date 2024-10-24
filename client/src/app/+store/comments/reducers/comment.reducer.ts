import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CommentActions } from '../actions/comment.actions';
import { CommentInterface } from '../../../shared/models/interfaces/comment.interface';
import { UpdateStr } from '@ngrx/entity/src/models';

export const commentsFeatureKey = 'comments';

export interface State extends EntityState<CommentInterface> {
  cursor: string | null;
  hasMore: boolean;
}

export const adapter: EntityAdapter<CommentInterface> =
  createEntityAdapter<CommentInterface>({
    sortComparer: (a: CommentInterface, b: CommentInterface): number =>
      a.id.localeCompare(b.id),
  });

export const initialState: State = adapter.getInitialState({
  cursor: null,
  hasMore: true,
});

export const reducer = createReducer(
  initialState,
  on(CommentActions.addCommentSuccess, (state, action) =>
    adapter.addOne(action.comment, state),
  ),
  // on(CommentActions.upsertComment, (state, action) =>
  //   adapter.upsertOne(action.comment, state),
  // ),
  // on(CommentActions.addComments, (state, action) =>
  //   adapter.addMany(action.comments, state),
  // ),
  // on(CommentActions.upsertComments, (state, action) =>
  //   adapter.upsertMany(action.comments, state),
  // ),
  // on(CommentActions.updateComment, (state, action) =>
  //   adapter.updateOne(action.comment, state),
  // ),
  // on(CommentActions.updateComments, (state, action) =>
  //   adapter.updateMany(action.comments, state),
  // ),
  // on(CommentActions.deleteComment, (state, action) =>
  //   adapter.removeOne(action.id, state),
  // ),
  // on(CommentActions.deleteComments, (state, action) =>
  //   adapter.removeMany(action.ids, state),
  // ),
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
  // on(CommentActions.clearComments, (state) => adapter.removeAll(state)),
);
