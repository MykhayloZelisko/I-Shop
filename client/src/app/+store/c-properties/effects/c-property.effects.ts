import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CPropertiesService } from '../services/c-properties.service';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';
import { CPropertyActions } from '../actions/c-property.actions';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { LoaderActions } from '../../loader/actions/loader.actions';
import { CPropertiesGroupActions } from '../../c-properties-groups/actions/c-properties-group.actions';
import { PopupActions } from '../../popup/actions/popup.actions';
import { SharedActions } from '../../shared/actions/shared.actions';

export const addFilteredProperties$ = createEffect(
  (
    actions$ = inject(Actions),
    cPropertiesService = inject(CPropertiesService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CPropertyActions.addFilteredProperties),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        cPropertiesService.getFilteredCProperties(action.ids).pipe(
          mergeMap((properties) => [
            LoaderActions.toggleLoader(),
            CPropertyActions.addCPropertiesSuccess({ properties }),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(CPropertyActions.addCPropertiesFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const addCPropertiesByGroupsIds$ = createEffect(
  (
    actions$ = inject(Actions),
    cPropertiesService = inject(CPropertiesService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CPropertyActions.addCPropertiesByGroupsIds),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        cPropertiesService.addCPropertiesByGroupsIds(action.ids).pipe(
          mergeMap((properties) => [
            LoaderActions.toggleLoader(),
            CPropertyActions.addCPropertiesSuccess({ properties }),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(CPropertyActions.addCPropertiesFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const addCProperties$ = createEffect(
  (
    actions$ = inject(Actions),
    cPropertiesService = inject(CPropertiesService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CPropertyActions.addCProperties),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        cPropertiesService.addCProperties(action.properties).pipe(
          mergeMap((properties) => [
            LoaderActions.toggleLoader(),
            CPropertyActions.addCPropertiesSuccess({ properties }),
            CPropertiesGroupActions.updateCPropertiesGroupSuccess({
              group: { ...action.group, hasProperties: true },
            }),
            PopupActions.closePopup(),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(CPropertyActions.addCPropertiesFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const addCPropertiesFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CPropertyActions.addCPropertiesFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const addCPropertiesByGroupId$ = createEffect(
  (
    actions$ = inject(Actions),
    cPropertiesService = inject(CPropertiesService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CPropertyActions.addCPropertiesByGroupId),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        cPropertiesService.getCPropertiesByGroupId(action.group.id).pipe(
          mergeMap((properties) => [
            LoaderActions.toggleLoader(),
            CPropertyActions.addCPropertiesByGroupIdSuccess({
              group: action.group,
              properties,
            }),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(CPropertyActions.addCPropertiesByGroupIdFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const addCPropertiesByGroupIdSuccess$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CPropertyActions.addCPropertiesByGroupIdSuccess),
      map((action) =>
        CPropertiesGroupActions.updateCPropertiesGroupSuccess({
          group: { ...action.group, expanded: true },
        }),
      ),
    ),
  { functional: true },
);

export const addCPropertiesByGroupIdFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CPropertyActions.addCPropertiesByGroupIdFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const updateCProperty$ = createEffect(
  (
    actions$ = inject(Actions),
    cPropertiesService = inject(CPropertiesService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CPropertyActions.updateCProperty),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        cPropertiesService.updateCProperty(action.id, action.propertyName).pipe(
          mergeMap((property) => [
            LoaderActions.toggleLoader(),
            CPropertyActions.updateCPropertySuccess({ property }),
            SharedActions.clearCGPState(),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(CPropertyActions.updateCPropertyFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const updateCPropertyFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CPropertyActions.updateCPropertyFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const deleteCProperty$ = createEffect(
  (
    actions$ = inject(Actions),
    cPropertiesService = inject(CPropertiesService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CPropertyActions.deleteCProperty),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        cPropertiesService.deleteCProperty(action.id).pipe(
          mergeMap((deleted) => {
            const actions: ReturnType<
              | typeof CPropertyActions.deleteCPropertySuccess
              | typeof CPropertiesGroupActions.updateCPropertiesGroupSuccess
              | typeof LoaderActions.toggleLoader
            >[] = [
              LoaderActions.toggleLoader(),
              CPropertyActions.deleteCPropertySuccess({
                id: deleted.propertiesIds[0],
              }),
            ];

            if (deleted.group) {
              actions.push(
                CPropertiesGroupActions.updateCPropertiesGroupSuccess({
                  group: {
                    ...deleted.group,
                    expanded: deleted.group.hasProperties,
                  },
                }),
              );
            }

            return actions;
          }),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(CPropertyActions.deleteCPropertyFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const deleteCPropertyFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CPropertyActions.deleteCPropertyFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);
