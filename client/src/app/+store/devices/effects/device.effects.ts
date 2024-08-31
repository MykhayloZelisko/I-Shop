import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DevicesService } from '../services/devices.service';
import { catchError, mergeMap, of, switchMap, tap } from 'rxjs';
import { LoaderActions } from '../../loader/actions/loader.actions';
import { FormActions } from '../../form/actions/form.actions';
import { DeviceActions } from '../actions/device.actions';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';

@Injectable()
export class DeviceEffects {
  private actions$ = inject(Actions);

  private devicesService = inject(DevicesService);

  private store = inject(Store<State>);

  public createDevice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeviceActions.createDevice),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.devicesService.createDevice(action.device).pipe(
          mergeMap(() => [
            LoaderActions.toggleLoader(),
            DeviceActions.createDeviceSuccess(),
            FormActions.clearFormOn(),
          ]),
          catchError(() => {
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(DeviceActions.createDeviceFailure());
          }),
        ),
      ),
    ),
  );
}
