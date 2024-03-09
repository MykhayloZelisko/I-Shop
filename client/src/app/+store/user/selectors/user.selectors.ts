import { createFeatureSelector } from '@ngrx/store';
import { userFeatureKey } from '../reducers/user.reducer';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';

export const userSelector =
  createFeatureSelector<UserInterface>(userFeatureKey);
