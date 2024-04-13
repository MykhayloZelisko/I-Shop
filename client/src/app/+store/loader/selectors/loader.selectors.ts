import { createFeatureSelector, createSelector } from '@ngrx/store';
import { loaderFeatureKey, State } from '../reducers/loader.reducer';

export const selectLoaderState = createFeatureSelector<State>(loaderFeatureKey);

export const selectLoader = createSelector(
  selectLoaderState,
  (state: State) => state.show,
);
