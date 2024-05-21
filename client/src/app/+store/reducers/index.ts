import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as popup from '../popup/reducers/popup.reducer';
import * as auth from '../auth/reducers/auth.reducer';
import * as categories from '../categories/reducers/category.reducer';
import * as loader from '../loader/reducers/loader.reducer';
import * as catalog from '../catalog/reducers/catalog.reducer';

export interface State {
  auth: auth.State;
  popup: popup.State;
  categories: categories.State;
  loader: loader.State;
  catalog: catalog.State;
}

export const reducers: ActionReducerMap<State> = {
  auth: auth.reducer,
  popup: popup.reducer,
  categories: categories.reducer,
  loader: loader.reducer,
  catalog: catalog.reducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
