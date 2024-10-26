import {
  createFeature,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import {
  adapter,
  commentsFeatureKey,
  reducer,
  State,
} from '../reducers/comment.reducer';

const selectCommentState = createFeatureSelector<State>(commentsFeatureKey);

export const commentsFeature = createFeature({
  name: commentsFeatureKey,
  reducer,
  extraSelectors: ({ selectCommentsState }) => ({
    ...adapter.getSelectors(selectCommentsState),
  }),
});

export const selectAllComments = commentsFeature.selectAll;

export const selectEntitiesComments = commentsFeature.selectEntities;

export const selectIdsComments = commentsFeature.selectIds;

export const selectTotalComments = commentsFeature.selectTotal;

export const selectCommentsStatus = createSelector(
  selectCommentState,
  (state: State) => ({
    hasMore: state.hasMore,
    cursor: state.cursor,
  }),
);

export const selectCurrentComment = createSelector(
  selectCommentState,
  (state: State) => state.currentComment,
);
