import { inject, Injectable } from '@angular/core';
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

@Injectable()
export class CategoryEffects {
  private actions$ = inject(Actions);

  private categoriesService = inject(CategoriesService);

  private store = inject(Store<State>);

  public loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.loadCategories),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap(() =>
        this.categoriesService.getAllCategories().pipe(
          mergeMap((categories: CategoryInterface[]) => [
            LoaderActions.toggleLoader(),
            CategoryActions.loadCategoriesSuccess({ categories }),
          ]),
          catchError(() => {
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(CategoryActions.loadCategoriesFailure());
          }),
        ),
      ),
    ),
  );

  public loadCategoriesFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CategoryActions.loadCategoriesFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public updateCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.updateCategory),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.categoriesService.updateCategory(action.id, action.category).pipe(
          mergeMap((category) => [
            LoaderActions.toggleLoader(),
            CategoryActions.updateCategorySuccess({ category }),
            SharedActions.clearCGPState(),
          ]),
          catchError(() => {
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(CategoryActions.updateCategoryFailure());
          }),
        ),
      ),
    ),
  );

  public updateCategoryFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CategoryActions.updateCategoryFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public addCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.addCategory),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.categoriesService.createCategory(action.category).pipe(
          mergeMap((category) => [
            LoaderActions.toggleLoader(),
            CategoryActions.addCategorySuccess({ category }),
            SharedActions.clearCGPState(),
          ]),
          catchError(() => {
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(CategoryActions.addCategoryFailure());
          }),
        ),
      ),
    ),
  );

  public addCategoryFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CategoryActions.addCategoryFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public addCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.addCategories),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.categoriesService.addSubCategories(action.categories).pipe(
          mergeMap((categories) => [
            LoaderActions.toggleLoader(),
            CategoryActions.addCategoriesSuccess({ categories }),
            PopupActions.closePopup(),
          ]),
          catchError(() => {
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(CategoryActions.addCategoriesFailure());
          }),
        ),
      ),
    ),
  );

  public addCategoriesFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CategoryActions.addCategoriesFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public deleteCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.deleteCategory),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.categoriesService.deleteCategory(action.id).pipe(
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
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(CategoryActions.deleteCategoryFailure());
          }),
        ),
      ),
    ),
  );

  public deleteCategoryFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CategoryActions.deleteCategoryFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );
}
