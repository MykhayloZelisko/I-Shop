import { createFeatureSelector } from '@ngrx/store';
import { authDialogFeatureKey, State } from '../reducers/auth-dialog.reducer';

export const authDialogSelector =
  createFeatureSelector<State>(authDialogFeatureKey);
