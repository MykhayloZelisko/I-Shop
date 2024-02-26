import { createFeatureSelector } from '@ngrx/store';
import { userFeatureKey } from '../reducers/user.reducer';
import { State } from '../../reducers';

export const userSelector = createFeatureSelector<State>(userFeatureKey);
