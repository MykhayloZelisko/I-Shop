import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DevicesService } from '../services/devices.service';
import { catchError, mergeMap, of, switchMap, tap } from 'rxjs';
import { LoaderActions } from '../../loader/actions/loader.actions';
import { FormActions } from '../../form/actions/form.actions';
import { DeviceActions } from '../actions/device.actions';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';

export const createDevice$ = createEffect(
  (
    actions$ = inject(Actions),
    devicesService = inject(DevicesService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(DeviceActions.createDevice),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        devicesService.createDevice(action.device).pipe(
          mergeMap(() => [
            LoaderActions.toggleLoader(),
            DeviceActions.createDeviceSuccess(),
            FormActions.clearFormOn(),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(DeviceActions.createDeviceFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const createDeviceFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(DeviceActions.createDeviceFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const loadDevices$ = createEffect(
  (
    actions$ = inject(Actions),
    devicesService = inject(DevicesService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(DeviceActions.loadDevices),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        devicesService.getDevices(action.id, action.page, action.size).pipe(
          mergeMap((devicesList) => [
            LoaderActions.toggleLoader(),
            DeviceActions.loadDevicesSuccess({ devicesList }),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(DeviceActions.loadDevicesFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const loadDevicesFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(DeviceActions.loadDevicesFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const addDevices$ = createEffect(
  (
    actions$ = inject(Actions),
    devicesService = inject(DevicesService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(DeviceActions.addDevices),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        devicesService.getDevices(action.id, action.page, action.size).pipe(
          mergeMap((devicesList) => [
            LoaderActions.toggleLoader(),
            DeviceActions.addDevicesSuccess({ devicesList }),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(DeviceActions.addDevicesFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const addDevicesFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(DeviceActions.addDevicesFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const loadDevice$ = createEffect(
  (
    actions$ = inject(Actions),
    devicesService = inject(DevicesService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(DeviceActions.loadDevice),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        devicesService.getDeviceById(action.id).pipe(
          mergeMap((device) => [
            LoaderActions.toggleLoader(),
            DeviceActions.loadDeviceSuccess({ device }),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(DeviceActions.loadDeviceFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const loadDeviceFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(DeviceActions.loadDeviceFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);
