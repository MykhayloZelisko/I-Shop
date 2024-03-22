import { createActionGroup, emptyProps } from '@ngrx/store';

export const LogoutActions = createActionGroup({
  source: 'Logout',
  events: {
    Logout: emptyProps(),
    LogoutSuccess: emptyProps(),
    LogoutFailure: emptyProps(),
  },
});
