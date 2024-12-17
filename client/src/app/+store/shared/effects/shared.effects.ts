import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SharedService } from '../services/shared.service';
import { catchError, mergeMap, of, switchMap, tap } from 'rxjs';
import { LoaderActions } from '../../loader/actions/loader.actions';
import { State } from '../../reducers';
import { Store } from '@ngrx/store';
import { SharedActions } from '../actions/shared.actions';
import { CPropertyActions } from '../../c-properties/actions/c-property.actions';
import { CPropertiesGroupActions } from '../../c-properties-groups/actions/c-properties-group.actions';
import { GPInterface } from '../../../shared/models/interfaces/g-p.interface';

export const addGroupsWithProperties$ = createEffect(
  (
    actions$ = inject(Actions),
    sharedService = inject(SharedService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(SharedActions.addGroupsWithProperties),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        sharedService.getGroupsWithProperties(action.id).pipe(
          mergeMap((response: GPInterface) => [
            LoaderActions.toggleLoader(),
            CPropertiesGroupActions.addCPropertiesGroupsSuccess({
              groups: response.groups,
            }),
            CPropertyActions.addCPropertiesSuccess({
              properties: response.properties,
            }),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(SharedActions.addGroupsWithPropertiesFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const addGroupsWithPropertiesFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(SharedActions.addGroupsWithPropertiesFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);
