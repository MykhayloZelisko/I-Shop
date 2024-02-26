import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';

export const GetMeActions = createActionGroup({
  source: 'GetMe',
  events: {
    getMe: emptyProps(),
    getMeSuccess: props<UserInterface>(),
  },
});
