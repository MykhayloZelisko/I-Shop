import { createReducer, on } from '@ngrx/store';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { LoginActions } from '../actions/login.actions';
import { GetMeActions } from '../actions/get-me.actions';
import { LogoutActions } from '../actions/logout.actions';

export const userFeatureKey = 'auth';

export interface State {
  user: UserInterface | null;
  registrationError: {
    code: number;
    message: string;
  } | null;
  loginError: {
    code: number;
    message: string;
  } | null;
}

export const initialState: State = {
  user: null,
  registrationError: null,
  loginError: null,
};

export const reducer = createReducer(
  initialState,
  on(LoginActions.loginSuccess, GetMeActions.getMeSuccess, (state, action) => ({
    ...state,
    user: action.user,
  })),
  on(LogoutActions.logoutSuccess, (state) => ({
    ...state,
    ...initialState,
  })),
  // TODO: change reducer with error
  on(GetMeActions.getMeFailure, (state) => ({
    ...state,
    ...initialState,
  })),
);
