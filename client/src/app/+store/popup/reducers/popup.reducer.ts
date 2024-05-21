import { createReducer, on } from '@ngrx/store';
import { PopupActions } from '../actions/popup.actions';
import { PopupTypeEnum } from '../../../shared/models/enums/popup-type.enum';

export const popupFeatureKey = 'popup';

export interface State {
  title: string;
  popupType: PopupTypeEnum;
}

export const initialState: State = {
  title: '',
  popupType: PopupTypeEnum.None,
};

export const reducer = createReducer(
  initialState,
  on(PopupActions.openPopup, (state, action) => ({
    ...state,
    ...action.popup,
  })),
  on(PopupActions.closePopup, (state) => ({
    ...state,
    popupType: PopupTypeEnum.None,
  })),
);
