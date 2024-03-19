import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { RegistrationInterface } from '../../../shared/models/interfaces/registration.interface';

export const RegistrationActions = createActionGroup({
  source: 'Registration',
  events: {
    Registration: props<{ registration: RegistrationInterface }>(),
    RegistrationSuccess: emptyProps(),
    RegistrationFailure: emptyProps(),
  },
});
