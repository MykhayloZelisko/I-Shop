import { inject, Injectable } from '@angular/core';
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

@Injectable()
export class CPropertyEffects {
  private actions$ = inject(Actions);

  private cPropertiesService = inject(CPropertiesService);

  private store = inject(Store<State>);

  public addFilteredProperties$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CPropertyActions.addFilteredProperties),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.cPropertiesService.getFilteredCProperties(action.ids).pipe(
          mergeMap((properties) => [
            LoaderActions.toggleLoader(),
            CPropertyActions.addCPropertiesSuccess({ properties }),
          ]),
          catchError(() => {
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(CPropertyActions.addCPropertiesFailure());
          }),
        ),
      ),
    ),
  );

  public addCPropertiesByGroupsIds$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CPropertyActions.addCPropertiesByGroupsIds),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.cPropertiesService.addCPropertiesByGroupsIds(action.ids).pipe(
          mergeMap((properties) => [
            LoaderActions.toggleLoader(),
            CPropertyActions.addCPropertiesSuccess({ properties }),
          ]),
          catchError(() => {
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(CPropertyActions.addCPropertiesFailure());
          }),
        ),
      ),
    ),
  );

  public addCProperties$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CPropertyActions.addCProperties),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.cPropertiesService.addCProperties(action.properties).pipe(
          mergeMap((properties) => [
            LoaderActions.toggleLoader(),
            CPropertyActions.addCPropertiesSuccess({ properties }),
            CPropertiesGroupActions.updateCPropertiesGroupSuccess({
              group: { ...action.group, hasProperties: true },
            }),
            PopupActions.closePopup(),
          ]),
          catchError(() => {
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(CPropertyActions.addCPropertiesFailure());
          }),
        ),
      ),
    ),
  );

  public addCPropertiesFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CPropertyActions.addCPropertiesFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public addCPropertiesByGroupId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CPropertyActions.addCPropertiesByGroupId),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.cPropertiesService.getCPropertiesByGroupId(action.group.id).pipe(
          mergeMap((properties) => [
            LoaderActions.toggleLoader(),
            CPropertyActions.addCPropertiesByGroupIdSuccess({
              group: action.group,
              properties,
            }),
          ]),
          catchError(() => {
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(CPropertyActions.addCPropertiesByGroupIdFailure());
          }),
        ),
      ),
    ),
  );

  public addCPropertiesByGroupIdSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CPropertyActions.addCPropertiesByGroupIdSuccess),
      map((action) =>
        CPropertiesGroupActions.updateCPropertiesGroupSuccess({
          group: { ...action.group, expanded: true },
        }),
      ),
    ),
  );

  public addCPropertiesByGroupIdFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CPropertyActions.addCPropertiesByGroupIdFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public updateCProperty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CPropertyActions.updateCProperty),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.cPropertiesService
          .updateCProperty(action.id, action.propertyName)
          .pipe(
            mergeMap((property) => [
              LoaderActions.toggleLoader(),
              CPropertyActions.updateCPropertySuccess({ property }),
              SharedActions.clearCGPState(),
            ]),
            catchError(() => {
              this.store.dispatch(LoaderActions.toggleLoader());
              return of(CPropertyActions.updateCPropertyFailure());
            }),
          ),
      ),
    ),
  );

  public updateCPropertyFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CPropertyActions.updateCPropertyFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public deleteCProperty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CPropertyActions.deleteCProperty),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.cPropertiesService.deleteCProperty(action.id).pipe(
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
                  group: deleted.group,
                }),
              );
            }

            return actions;
          }),
          catchError(() => {
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(CPropertyActions.deleteCPropertyFailure());
          }),
        ),
      ),
    ),
  );

  public deleteCPropertyFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CPropertyActions.deleteCPropertyFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );
}
