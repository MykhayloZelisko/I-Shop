import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { LoginInterface } from '../../../shared/models/interfaces/login.interface';
import { RegistrationInterface } from '../../../shared/models/interfaces/registration.interface';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    // GetMe
    GetMe: emptyProps(),
    GetMeSuccess: props<{ user: UserInterface }>(),
    GetMeFailure: emptyProps(),
    // Login
    Login: props<{ login: LoginInterface }>(),
    LoginSuccess: props<{ user: UserInterface }>(),
    LoginFailure: emptyProps(),
    // Logout
    Logout: emptyProps(),
    LogoutSuccess: emptyProps(),
    LogoutFailure: emptyProps(),
    // Registration
    Registration: props<{ registration: RegistrationInterface }>(),
    RegistrationSuccess: emptyProps(),
    RegistrationFailure: emptyProps(),
  },
});
