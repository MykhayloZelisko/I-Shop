import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LoginInterface } from '../../../shared/models/interfaces/login.interface';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';

export const LoginActions = createActionGroup({
  source: 'Login',
  events: {
    Login: props<{ login: LoginInterface }>(),
    LoginSuccess: props<{ user: UserInterface }>(),
    LoginFailure: emptyProps(),
  },
});
