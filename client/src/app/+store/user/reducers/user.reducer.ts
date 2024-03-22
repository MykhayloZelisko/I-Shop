import { createReducer, on } from '@ngrx/store';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { LoginActions } from '../actions/login.actions';
import { GetMeActions } from '../actions/get-me.actions';
import { LogoutActions } from '../actions/logout.actions';

export const userFeatureKey = 'user';

export const initialState: UserInterface | null = null;

export const userReducer = createReducer(
  initialState as UserInterface | null,
  on(LoginActions.loginSuccess, (_state, action) => action.user),
  on(GetMeActions.getMeSuccess, (_state, action) => action.user),
  on(GetMeActions.getMeFailure, () => null),
  on(LogoutActions.logoutSuccess, () => null),
);
