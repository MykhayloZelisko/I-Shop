import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as popup from '../popup/reducers/popup.reducer';
import * as auth from '../auth/reducers/auth.reducer';
import * as categories from '../categories/reducers/category.reducer';
import * as loader from '../loader/reducers/loader.reducer';
import * as brands from '../brands/reducers/brand.reducer';
import * as form from '../form/reducers/form.reducer';
import * as devices from '../devices/reducers/device.reducer';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrlInterface } from '../router/serializer/custom-route-serializer';

export interface State {
  auth: auth.State;
  popup: popup.State;
  categories: categories.State;
  loader: loader.State;
  brands: brands.State;
  form: form.State;
  devices: devices.State;
  router: RouterReducerState<RouterStateUrlInterface>;
}

export const reducers: ActionReducerMap<State> = {
  auth: auth.reducer,
  popup: popup.reducer,
  categories: categories.reducer,
  loader: loader.reducer,
  brands: brands.reducer,
  form: form.reducer,
  devices: devices.reducer,
  router: routerReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
