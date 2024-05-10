import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CategoriesService } from '../services/categories.service';
import { CategoryActions } from '../actions/category.actions';
import { catchError, mergeMap, of, switchMap, tap } from 'rxjs';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import { DialogActions } from '../../dialog/actions/dialog.actions';
import { DialogTypeEnum } from '../../../shared/models/enums/dialog-type.enum';
import { LoaderActions } from '../../loader/actions/loader.actions';
import { State } from '../../reducers';
import { Store } from '@ngrx/store';

@Injectable()
export class CategoryEffects {
  private actions$ = inject(Actions);

  private categoriesService = inject(CategoriesService);

  private store = inject(Store<State>);

  public loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.loadCategories),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap(() => this.categoriesService.getAllCategories()),
      mergeMap((categories: CategoryInterface[]) => [
        LoaderActions.toggleLoader(),
        CategoryActions.loadCategoriesSuccess({ categories }),
      ]),
      catchError(() => {
        this.store.dispatch(LoaderActions.toggleLoader());
        return of(CategoryActions.loadCategoriesFailure());
      }),
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
        this.categoriesService.updateCategory(action.id, action.category),
      ),
      mergeMap((category) => [
        LoaderActions.toggleLoader(),
        CategoryActions.updateCategorySuccess({ category }),
        CategoryActions.changeCurrentCategoryStatus({
          categoryStatus: { id: null, isEditable: false },
        }),
      ]),
      catchError(() => {
        this.store.dispatch(LoaderActions.toggleLoader());
        return of(CategoryActions.updateCategoryFailure());
      }),
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
        this.categoriesService.createCategory(action.category),
      ),
      mergeMap((category) => [
        LoaderActions.toggleLoader(),
        CategoryActions.addCategorySuccess({ category }),
        CategoryActions.closeNewCategory(),
      ]),
      catchError(() => {
        this.store.dispatch(LoaderActions.toggleLoader());
        return of(CategoryActions.addCategoryFailure());
      }),
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
        this.categoriesService.addSubCategories(action.categories),
      ),
      mergeMap((categories) => [
        LoaderActions.toggleLoader(),
        CategoryActions.addCategoriesSuccess({ categories }),
        DialogActions.openDialog({
          dialog: { title: '', dialogType: DialogTypeEnum.None },
        }),
      ]),
      catchError(() => {
        this.store.dispatch(LoaderActions.toggleLoader());
        return of(CategoryActions.addCategoriesFailure());
      }),
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
      switchMap((action) => this.categoriesService.deleteCategory(action.id)),
      mergeMap((ids) => [
        LoaderActions.toggleLoader(),
        CategoryActions.deleteCategorySuccess({ ids }),
        CategoryActions.deleteCategories({ ids }),
      ]),
      catchError(() => {
        this.store.dispatch(LoaderActions.toggleLoader());
        return of(CategoryActions.deleteCategoryFailure());
      }),
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
