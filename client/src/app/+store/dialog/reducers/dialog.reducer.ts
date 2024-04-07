import { createReducer, on } from '@ngrx/store';
import { DialogTypeEnum } from '../../../shared/models/enums/dialog-type.enum';
import { DialogActions } from '../actions/dialog.actions';

export const dialogFeatureKey = 'dialog';

export interface State {
  title: string;
  dialogType: DialogTypeEnum;
}

export const initialState: State = {
  title: '',
  dialogType: DialogTypeEnum.None,
};

export const reducer = createReducer(
  initialState,
  on(DialogActions.openDialog, (state, action) => ({
    ...state,
    ...action.dialog,
  })),
);
