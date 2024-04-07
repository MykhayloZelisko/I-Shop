import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CategoriesService } from '../services/categories.service';
import { CategoryActions } from '../actions/category.actions';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';

@Injectable()
export class CategoryEffects {
  private actions$ = inject(Actions);

  private categoriesService = inject(CategoriesService);

  public loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.loadCategories),
      switchMap(() =>
        this.categoriesService.getAllCategories().pipe(
          map((categories: CategoryInterface[]) =>
            CategoryActions.loadCategoriesSuccess({ categories }),
          ),
          catchError(() => of(CategoryActions.loadCategoriesFailure())),
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
      switchMap((action) =>
        this.categoriesService
          .updateCategory(action.id, action.categoryName)
          .pipe(
            mergeMap((category) => [
              CategoryActions.updateCategorySuccess({ category }),
              CategoryActions.clearCurrentCategoryId(),
            ]),
            catchError(() => of(CategoryActions.updateCategoryFailure())),
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
      switchMap((action) =>
        this.categoriesService.createCategory(action.category).pipe(
          mergeMap((category) => [
            CategoryActions.addCategorySuccess({ category }),
            CategoryActions.closeNewCategory(),
          ]),
          catchError(() => of(CategoryActions.addCategoryFailure())),
        ),
      ),
    ),
  );

  public deleteCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.deleteCategory),
      switchMap((action) =>
        this.categoriesService.deleteCategory(action.id).pipe(
          mergeMap((ids) => [
            CategoryActions.deleteCategorySuccess({ ids }),
            CategoryActions.deleteCategories({ ids }),
          ]),
          catchError(() => of(CategoryActions.deleteCategoryFailure())),
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
