import { createActionGroup, props } from '@ngrx/store';
import { DialogDataInterface } from '../../../shared/models/interfaces/dialog-data.interface';

export const DialogActions = createActionGroup({
  source: 'Dialog',
  events: {
    OpenDialog: props<{ dialog: DialogDataInterface }>(),
  },
});
