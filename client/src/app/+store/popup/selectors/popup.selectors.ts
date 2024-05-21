import { createFeatureSelector } from '@ngrx/store';
import { popupFeatureKey, State } from '../reducers/popup.reducer';

export const selectPopup = createFeatureSelector<State>(popupFeatureKey);
