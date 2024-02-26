import { RegistrationEffects } from '../user/effects/registration.effects';
import { LoginEffects } from '../user/effects/login.effects';
import { GetMeEffects } from '../user/effects/get-me.effects';

export const AppEffects = [LoginEffects, RegistrationEffects, GetMeEffects];
