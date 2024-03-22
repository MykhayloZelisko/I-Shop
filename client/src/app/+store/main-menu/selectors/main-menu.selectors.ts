import { createFeatureSelector } from '@ngrx/store';
import { mainMenuFeatureKey } from '../reducers/main-menu.reducer';

export const mainMenuSelector =
  createFeatureSelector<boolean>(mainMenuFeatureKey);
