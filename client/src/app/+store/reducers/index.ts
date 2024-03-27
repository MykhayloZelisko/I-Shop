import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as authDialog from '../auth-dialog/reducers/auth-dialog.reducer';
import * as mainMenu from '../main-menu/reducers/main-menu.reducer';
import * as user from '../user/reducers/user.reducer';

export interface State {
  auth: user.State;
  authDialog: authDialog.State;
  mainMenu: mainMenu.State;
}

export const reducers: ActionReducerMap<State> = {
  auth: user.reducer,
  authDialog: authDialog.reducer,
  mainMenu: mainMenu.reducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
