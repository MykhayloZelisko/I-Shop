import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CategoriesService } from '../services/categories.service';
import { CategoryActions } from '../actions/category.actions';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import { DialogActions } from '../../dialog/actions/dialog.actions';
import { DialogTypeEnum } from '../../../shared/models/enums/dialog-type.enum';

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
              CategoryActions.changeCurrentCategoryStatus({
                categoryStatus: { id: null, isEditable: false },
              }),
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
      switchMap((action) =>
        this.categoriesService.addSubCategories(action.categories).pipe(
          mergeMap((categories) => [
            CategoryActions.addCategoriesSuccess({ categories }),
            DialogActions.openDialog({
              dialog: { title: '', dialogType: DialogTypeEnum.None },
            }),
          ]),
          catchError(() => of(CategoryActions.addCategoriesFailure())),
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
