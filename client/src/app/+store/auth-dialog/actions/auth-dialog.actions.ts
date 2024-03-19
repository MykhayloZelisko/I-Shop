import { createActionGroup, props } from '@ngrx/store';
import { AuthDialogDataInterface } from '../../../shared/models/interfaces/auth-dialog-data.interface';

export const AuthDialogActions = createActionGroup({
  source: 'AuthDialog',
  events: {
    AuthDialog: props<{ dialog: AuthDialogDataInterface }>(),
  },
});
