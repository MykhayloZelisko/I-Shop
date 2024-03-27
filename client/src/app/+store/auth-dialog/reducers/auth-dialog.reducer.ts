import { createReducer, on } from '@ngrx/store';
import { AuthDialogDataInterface } from '../../../shared/models/interfaces/auth-dialog-data.interface';
import { AuthDialogTypeEnum } from '../../../shared/models/enums/auth-dialog-type.enum';
import { AuthDialogActions } from '../actions/auth-dialog.actions';

export const authDialogFeatureKey = 'authDialog';

export interface State {
  title: string;
  dialogType: AuthDialogTypeEnum;
}

export const initialState: State = {
  title: '',
  dialogType: AuthDialogTypeEnum.None,
};

export const reducer = createReducer(
  initialState,
  on(AuthDialogActions.authDialog, (state, action) => ({
    ...state,
    ...action.dialog,
  })),
);
