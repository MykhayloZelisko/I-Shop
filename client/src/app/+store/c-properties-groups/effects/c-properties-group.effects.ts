import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';
import { CPropertiesGroupsService } from '../services/c-properties-groups.service';
import { CPropertiesGroupActions } from '../actions/c-properties-group.actions';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { LoaderActions } from '../../loader/actions/loader.actions';
import { CategoryActions } from '../../categories/actions/category.actions';
import { PopupActions } from '../../popup/actions/popup.actions';
import { SharedActions } from '../../shared/actions/shared.actions';
import { CPropertyActions } from '../../c-properties/actions/c-property.actions';
import { environment } from '../../../../environments/environment';

export const addFilteredGroups$ = createEffect(
  (
    actions$ = inject(Actions),
    cPropertiesGroupsService = inject(CPropertiesGroupsService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CPropertiesGroupActions.addFilteredGroups),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        cPropertiesGroupsService.getFilteredCPropertiesGroups(action.ids).pipe(
          mergeMap((groups) => [
            LoaderActions.toggleLoader(),
            CPropertiesGroupActions.addFilteredGroupsSuccess({ groups }),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(CPropertiesGroupActions.addFilteredGroupsFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const addFilteredGroupsSuccess$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CPropertiesGroupActions.addFilteredGroupsSuccess),
      map(() =>
        CPropertiesGroupActions.updateCPropertiesGroups({
          expanded: true,
          loadedProperties: true,
        }),
      ),
    ),
  { functional: true },
);

export const addFilteredGroupsFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CPropertiesGroupActions.addFilteredGroupsFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const addCPGroupsByCategoryId$ = createEffect(
  (
    actions$ = inject(Actions),
    cPropertiesGroupsService = inject(CPropertiesGroupsService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CPropertiesGroupActions.addCPGroupsByCategoryId),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        cPropertiesGroupsService
          .getCPGroupsByCategoryId(action.category.id)
          .pipe(
            mergeMap((groups) => [
              LoaderActions.toggleLoader(),
              CPropertiesGroupActions.addCPGroupsByCategoryIdSuccess({
                category: action.category,
                groups,
              }),
            ]),
            catchError(() => {
              store.dispatch(LoaderActions.toggleLoader());
              return of(
                CPropertiesGroupActions.addCPGroupsByCategoryIdFailure(),
              );
            }),
          ),
      ),
    ),
  { functional: true },
);

export const addCPGroupsByCategoryIdSuccess$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CPropertiesGroupActions.addCPGroupsByCategoryIdSuccess),
      map((action) =>
        CategoryActions.updateCategorySuccess({
          category: { ...action.category, expanded: true },
        }),
      ),
    ),
  { functional: true },
);

export const addCPGroupsByCategoryIdFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CPropertiesGroupActions.addCPGroupsByCategoryIdFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const addCPropertiesGroups$ = createEffect(
  (
    actions$ = inject(Actions),
    cPropertiesGroupsService = inject(CPropertiesGroupsService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CPropertiesGroupActions.addCPropertiesGroups),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        cPropertiesGroupsService.addCPropertiesGroups(action.groups).pipe(
          mergeMap((groups) => [
            LoaderActions.toggleLoader(),
            CPropertiesGroupActions.addCPropertiesGroupsSuccess({ groups }),
            CategoryActions.updateCategorySuccess({
              category: { ...action.category, hasGroups: true },
            }),
            PopupActions.closePopup(),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(CPropertiesGroupActions.addCPropertiesGroupsFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const addCPropertiesGroupsFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CPropertiesGroupActions.addCPropertiesGroupsFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const updateCPropertiesGroup$ = createEffect(
  (
    actions$ = inject(Actions),
    cPropertiesGroupsService = inject(CPropertiesGroupsService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CPropertiesGroupActions.updateCPropertiesGroup),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        cPropertiesGroupsService
          .updateCPropertiesGroup(action.id, action.groupName)
          .pipe(
            mergeMap((group) => [
              LoaderActions.toggleLoader(),
              CPropertiesGroupActions.updateCPropertiesGroupSuccess({ group }),
              SharedActions.clearCGPState(),
            ]),
            catchError(() => {
              store.dispatch(LoaderActions.toggleLoader());
              return of(
                CPropertiesGroupActions.updateCPropertiesGroupFailure(),
              );
            }),
          ),
      ),
    ),
  { functional: true },
);

export const updateCPropertiesGroupFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CPropertiesGroupActions.updateCPropertiesGroupFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const deleteCPropertiesGroup$ = createEffect(
  (
    actions$ = inject(Actions),
    cPropertiesGroupsService = inject(CPropertiesGroupsService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CPropertiesGroupActions.deleteCPropertiesGroup),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        cPropertiesGroupsService.deleteCPropertiesGroup(action.id).pipe(
          mergeMap((deleted) => {
            const actions: ReturnType<
              | typeof CPropertyActions.deleteCProperties
              | typeof CPropertiesGroupActions.deleteCPropertiesGroupSuccess
              | typeof LoaderActions.toggleLoader
              | typeof CategoryActions.updateCategorySuccess
            >[] = [
              LoaderActions.toggleLoader(),
              CPropertiesGroupActions.deleteCPropertiesGroupSuccess({
                id: deleted.groupsIds[0],
              }),
              CPropertyActions.deleteCProperties({
                ids: deleted.propertiesIds,
              }),
            ];

            if (deleted.category) {
              actions.push(
                CategoryActions.updateCategorySuccess({
                  category: {
                    ...deleted.category,
                    image: `${environment.baseUrl}/${deleted.category.image}`,
                    expanded: deleted.category.hasGroups,
                  },
                }),
              );
            }

            return actions;
          }),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(CPropertiesGroupActions.deleteCPropertiesGroupFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const deleteCPropertiesGroupFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CPropertiesGroupActions.deleteCPropertiesGroupFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);
