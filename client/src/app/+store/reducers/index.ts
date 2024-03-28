import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as authDialog from '../auth-dialog/reducers/auth-dialog.reducer';
import * as mainMenu from '../main-menu/reducers/main-menu.reducer';
import * as auth from '../auth/reducers/auth.reducer';

export interface State {
  auth: auth.State;
  authDialog: authDialog.State;
  mainMenu: mainMenu.State;
}

export const reducers: ActionReducerMap<State> = {
  auth: auth.reducer,
  authDialog: authDialog.reducer,
  mainMenu: mainMenu.reducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
