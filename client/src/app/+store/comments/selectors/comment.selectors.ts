import { createFeature, createFeatureSelector, createSelector } from '@ngrx/store';
import {
  adapter,
  commentsFeatureKey,
  reducer,
} from '../reducers/comment.reducer';
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
