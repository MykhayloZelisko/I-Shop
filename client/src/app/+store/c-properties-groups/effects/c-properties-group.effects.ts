import { inject, Injectable } from '@angular/core';
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

@Injectable()
export class CPropertiesGroupEffects {
  private actions$ = inject(Actions);

  private cPropertiesGroupsService = inject(CPropertiesGroupsService);

  private store = inject(Store<State>);

  public addFilteredGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CPropertiesGroupActions.addFilteredGroups),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.cPropertiesGroupsService
          .getFilteredCPropertiesGroups(action.ids)
          .pipe(
            mergeMap((groups) => [
              LoaderActions.toggleLoader(),
              CPropertiesGroupActions.addFilteredGroupsSuccess({ groups }),
            ]),
            catchError(() => {
              this.store.dispatch(LoaderActions.toggleLoader());
              return of(CPropertiesGroupActions.addFilteredGroupsFailure());
            }),
          ),
      ),
    ),
  );

  public addFilteredGroupsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CPropertiesGroupActions.addFilteredGroupsSuccess),
      map(() =>
        CPropertiesGroupActions.updateCPropertiesGroups({
          expanded: true,
          loadedProperties: true,
        }),
      ),
    ),
  );

  public addFilteredGroupsFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CPropertiesGroupActions.addFilteredGroupsFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public addCPGroupsByCategoryId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CPropertiesGroupActions.addCPGroupsByCategoryId),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.cPropertiesGroupsService
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
              this.store.dispatch(LoaderActions.toggleLoader());
              return of(
                CPropertiesGroupActions.addCPGroupsByCategoryIdFailure(),
              );
            }),
          ),
      ),
    ),
  );

  public addCPGroupsByCategoryIdSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CPropertiesGroupActions.addCPGroupsByCategoryIdSuccess),
      map((action) =>
        CategoryActions.updateCategorySuccess({
          category: { ...action.category, expanded: true },
        }),
      ),
    ),
  );

  public addCPGroupsByCategoryIdFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CPropertiesGroupActions.addCPGroupsByCategoryIdFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public addCPropertiesGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CPropertiesGroupActions.addCPropertiesGroups),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.cPropertiesGroupsService.addCPropertiesGroups(action.groups).pipe(
          mergeMap((groups) => [
            LoaderActions.toggleLoader(),
            CPropertiesGroupActions.addCPropertiesGroupsSuccess({ groups }),
            CategoryActions.updateCategorySuccess({
              category: { ...action.category, hasGroups: true },
            }),
            PopupActions.closePopup(),
          ]),
          catchError(() => {
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(CPropertiesGroupActions.addCPropertiesGroupsFailure());
          }),
        ),
      ),
    ),
  );

  public addCPropertiesGroupsFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CPropertiesGroupActions.addCPropertiesGroupsFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public updateCPropertiesGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CPropertiesGroupActions.updateCPropertiesGroup),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.cPropertiesGroupsService
          .updateCPropertiesGroup(action.id, action.groupName)
          .pipe(
            mergeMap((group) => [
              LoaderActions.toggleLoader(),
              CPropertiesGroupActions.updateCPropertiesGroupSuccess({ group }),
              SharedActions.clearCGPState(),
            ]),
            catchError(() => {
              this.store.dispatch(LoaderActions.toggleLoader());
              return of(
                CPropertiesGroupActions.updateCPropertiesGroupFailure(),
              );
            }),
          ),
      ),
    ),
  );

  public updateCPropertiesGroupFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CPropertiesGroupActions.updateCPropertiesGroupFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public deleteCPropertiesGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CPropertiesGroupActions.deleteCPropertiesGroup),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.cPropertiesGroupsService.deleteCPropertiesGroup(action.id).pipe(
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
                  category: deleted.category,
                }),
              );
            }

            return actions;
          }),
          catchError(() => {
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(CPropertiesGroupActions.deleteCPropertiesGroupFailure());
          }),
        ),
      ),
    ),
  );

  public deleteCPropertiesGroupFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CPropertiesGroupActions.deleteCPropertiesGroupFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );
}
