import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { userReducer } from '../user/reducers/user.reducer';
import { UserInterface } from '../../shared/models/interfaces/user.interface';
import { AuthDialogDataInterface } from '../../shared/models/interfaces/auth-dialog-data.interface';
import { authDialogReducer } from '../auth-dialog/reducers/auth-dialog.reducer';

export interface State {
  user: UserInterface | null;
  authDialog: AuthDialogDataInterface;
}

export const reducers: ActionReducerMap<State> = {
  user: userReducer,
  authDialog: authDialogReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
