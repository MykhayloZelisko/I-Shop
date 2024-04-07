import { createFeatureSelector } from '@ngrx/store';
import { dialogFeatureKey, State } from '../reducers/dialog.reducer';

export const selectDialog = createFeatureSelector<State>(dialogFeatureKey);
