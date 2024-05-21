import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PopupDataInterface } from '../../../shared/models/interfaces/popup-data.interface';

export const PopupActions = createActionGroup({
  source: 'Popup',
  events: {
    OpenPopup: props<{ popup: PopupDataInterface }>(),
    ClosePopup: emptyProps(),
  },
});
