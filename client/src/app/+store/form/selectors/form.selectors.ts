import { createFeatureSelector, createSelector } from '@ngrx/store';
import { formFeatureKey, State } from '../reducers/form.reducer';

export const selectFormState = createFeatureSelector<State>(formFeatureKey);

export const selectFormCleared = createSelector(
  selectFormState,
  (state: State) => state.isCleared,
);
