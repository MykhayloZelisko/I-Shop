import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CategoriesService } from '../services/categories.service';
import { CategoryActions } from '../actions/category.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
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
            map((category) =>
              CategoryActions.updateCategorySuccess({ category }),
            ),
            catchError(() => of(CategoryActions.updateCategoryFailure())),
          ),
      ),
    ),
  );

  public updateCategorySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.updateCategorySuccess),
      map(() => CategoryActions.clearCurrentCategoryId()),
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

  public openNewCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.openNewCategory),
      map(() => CategoryActions.clearCurrentCategoryId()),
    ),
  );

  public setCurrentCategoryId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.setCurrentCategoryId),
      map(() => CategoryActions.closeNewCategory()),
    ),
  );

  public addCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.addCategory),
      switchMap((action) =>
        this.categoriesService.createCategory(action.category).pipe(
          map((category) => CategoryActions.addCategorySuccess({ category })),
          catchError(() => of(CategoryActions.addCategoryFailure())),
        ),
      ),
    ),
  );

  public addCategorySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.addCategorySuccess),
      map(() => CategoryActions.closeNewCategory()),
    ),
  );

  public deleteCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.deleteCategory),
      switchMap((action) =>
        this.categoriesService.deleteCategory(action.id).pipe(
          map((ids) => CategoryActions.deleteCategorySuccess({ ids })),
          catchError(() => of(CategoryActions.deleteCategoryFailure())),
        ),
      ),
    ),
  );

  public deleteCategorySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.deleteCategorySuccess),
      map((action) => CategoryActions.deleteCategories({ ids: action.ids })),
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
