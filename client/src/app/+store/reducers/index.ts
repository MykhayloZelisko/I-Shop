import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as popup from '../popup/reducers/popup.reducer';
import * as auth from '../auth/reducers/auth.reducer';
import * as categories from '../categories/reducers/category.reducer';
import * as loader from '../loader/reducers/loader.reducer';
import * as brands from '../brands/reducers/brand.reducer';
import * as form from '../form/reducers/form.reducer';
import * as device from '../devices/reducers/device.reducer';

export interface State {
  auth: auth.State;
  popup: popup.State;
  categories: categories.State;
  loader: loader.State;
  brands: brands.State;
  form: form.State;
  device: device.State;
}

export const reducers: ActionReducerMap<State> = {
  auth: auth.reducer,
  popup: popup.reducer,
  categories: categories.reducer,
  loader: loader.reducer,
  brands: brands.reducer,
  form: form.reducer,
  device: device.reducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
