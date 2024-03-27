import { createFeatureSelector } from '@ngrx/store';
import { mainMenuFeatureKey, State } from '../reducers/main-menu.reducer';

export const mainMenuSelector =
  createFeatureSelector<State>(mainMenuFeatureKey);
