import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CategoriesService } from '../services/categories.service';
import { CategoryActions } from '../actions/category.actions';
import { catchError, mergeMap, of, switchMap, tap } from 'rxjs';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import { LoaderActions } from '../../loader/actions/loader.actions';
import { State } from '../../reducers';
import { Store } from '@ngrx/store';
import { PopupActions } from '../../popup/actions/popup.actions';
import { SharedActions } from '../../shared/actions/shared.actions';
import { CPropertyActions } from '../../c-properties/actions/c-property.actions';
import { CPropertiesGroupActions } from '../../c-properties-groups/actions/c-properties-group.actions';

export const loadCategories$ = createEffect(
  (
    actions$ = inject(Actions),
    categoriesService = inject(CategoriesService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CategoryActions.loadCategories),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap(() =>
        categoriesService.getAllCategories().pipe(
          mergeMap((categories: CategoryInterface[]) => [
            LoaderActions.toggleLoader(),
            CategoryActions.loadCategoriesSuccess({ categories }),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(CategoryActions.loadCategoriesFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const loadCategoriesFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CategoryActions.loadCategoriesFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const updateCategory$ = createEffect(
  (
    actions$ = inject(Actions),
    categoriesService = inject(CategoriesService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CategoryActions.updateCategory),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        categoriesService.updateCategory(action.id, action.category).pipe(
          mergeMap((category) => [
            LoaderActions.toggleLoader(),
            CategoryActions.updateCategorySuccess({ category }),
            SharedActions.clearCGPState(),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(CategoryActions.updateCategoryFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const updateCategoryFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CategoryActions.updateCategoryFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const addCategory$ = createEffect(
  (
    actions$ = inject(Actions),
    categoriesService = inject(CategoriesService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CategoryActions.addCategory),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        categoriesService.createCategory(action.category).pipe(
          mergeMap((category) => [
            LoaderActions.toggleLoader(),
            CategoryActions.addCategorySuccess({ category }),
            SharedActions.clearCGPState(),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(CategoryActions.addCategoryFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const addCategoryFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CategoryActions.addCategoryFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const addCategories$ = createEffect(
  (
    actions$ = inject(Actions),
    categoriesService = inject(CategoriesService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CategoryActions.addCategories),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        categoriesService.addSubCategories(action.categories).pipe(
          mergeMap((categories) => [
            LoaderActions.toggleLoader(),
            CategoryActions.addCategoriesSuccess({ categories }),
            PopupActions.closePopup(),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(CategoryActions.addCategoriesFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const addCategoriesFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CategoryActions.addCategoriesFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const deleteCategory$ = createEffect(
  (
    actions$ = inject(Actions),
    categoriesService = inject(CategoriesService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CategoryActions.deleteCategory),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        categoriesService.deleteCategory(action.id).pipe(
          mergeMap((deleted) => {
            const actions: ReturnType<
              | typeof LoaderActions.toggleLoader
              | typeof CategoryActions.deleteCategorySuccess
              | typeof CPropertiesGroupActions.deleteCPropertiesGroups
              | typeof CPropertyActions.deleteCProperties
              | typeof CategoryActions.updateCategorySuccess
            >[] = [
              LoaderActions.toggleLoader(),
              CategoryActions.deleteCategorySuccess({
                ids: deleted.categoriesIds,
              }),
              CPropertiesGroupActions.deleteCPropertiesGroups({
                ids: deleted.groupsIds,
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
            store.dispatch(LoaderActions.toggleLoader());
            return of(CategoryActions.deleteCategoryFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const deleteCategoryFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CategoryActions.deleteCategoryFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);
