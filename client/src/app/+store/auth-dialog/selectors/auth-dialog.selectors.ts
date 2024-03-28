import { createFeatureSelector } from '@ngrx/store';
import { authDialogFeatureKey, State } from '../reducers/auth-dialog.reducer';

export const selectAuthDialog =
  createFeatureSelector<State>(authDialogFeatureKey);
