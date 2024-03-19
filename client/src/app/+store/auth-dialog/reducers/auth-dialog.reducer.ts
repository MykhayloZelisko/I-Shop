import { createReducer, on } from '@ngrx/store';
import { AuthDialogDataInterface } from '../../../shared/models/interfaces/auth-dialog-data.interface';
import { AuthDialogTypeEnum } from '../../../shared/models/enums/auth-dialog-type.enum';
import { AuthDialogActions } from '../actions/auth-dialog.actions';

export const authDialogFeatureKey = 'authDialog';

export const initialState: AuthDialogDataInterface = {
  title: '',
  dialogType: AuthDialogTypeEnum.None,
};

export const authDialogReducer = createReducer(
  initialState,
  on(AuthDialogActions.authDialog, (_state, action) => action.dialog),
);
