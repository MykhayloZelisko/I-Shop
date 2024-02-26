import { createReducer, on } from '@ngrx/store';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { LoginActions } from '../actions/login.actions';
import { GetMeActions } from '../actions/get-me.actions';

export const userFeatureKey = 'user';

export const initialState: unknown = null;

export const reducer = createReducer(
  initialState as UserInterface | null,
  on(LoginActions.loginSuccess, (_state, action) => action),
  on(GetMeActions.getMeSuccess, (_state, action) => action),
);
