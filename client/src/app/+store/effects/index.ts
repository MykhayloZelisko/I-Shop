import { RegistrationEffects } from '../user/effects/registration.effects';
import { LoginEffects } from '../user/effects/login.effects';
import { GetMeEffects } from '../user/effects/get-me.effects';
import { LogoutEffects } from '../user/effects/logout.effects';

export const AppEffects = [
  LoginEffects,
  RegistrationEffects,
  GetMeEffects,
  LogoutEffects,
];
