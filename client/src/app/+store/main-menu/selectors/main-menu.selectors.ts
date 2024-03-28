import { createFeatureSelector } from '@ngrx/store';
import { mainMenuFeatureKey, State } from '../reducers/main-menu.reducer';

export const selectMainMenu =
  createFeatureSelector<State>(mainMenuFeatureKey);
