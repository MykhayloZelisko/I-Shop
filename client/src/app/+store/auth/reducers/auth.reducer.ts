import { createReducer, on } from '@ngrx/store';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { AuthActions } from '../actions/auth.actions';

export const authFeatureKey = 'auth';

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
  on(AuthActions.loginSuccess, AuthActions.getMeSuccess, (state, action) => ({
    ...state,
    user: action.user,
  })),
  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    ...initialState,
  })),
);
