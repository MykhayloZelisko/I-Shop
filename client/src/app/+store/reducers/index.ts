import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as dialog from '../dialog/reducers/dialog.reducer';
import * as mainMenu from '../main-menu/reducers/main-menu.reducer';
import * as auth from '../auth/reducers/auth.reducer';
import * as categories from '../categories/reducers/category.reducer';

export interface State {
  auth: auth.State;
  dialog: dialog.State;
  mainMenu: mainMenu.State;
  categories: categories.State;
}

export const reducers: ActionReducerMap<State> = {
  auth: auth.reducer,
  dialog: dialog.reducer,
  mainMenu: mainMenu.reducer,
  categories: categories.reducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
