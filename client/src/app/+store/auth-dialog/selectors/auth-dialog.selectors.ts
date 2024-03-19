import { createFeatureSelector } from '@ngrx/store';
import { authDialogFeatureKey } from '../reducers/auth-dialog.reducer';
import { AuthDialogDataInterface } from '../../../shared/models/interfaces/auth-dialog-data.interface';

export const authDialogSelector =
  createFeatureSelector<AuthDialogDataInterface>(authDialogFeatureKey);
