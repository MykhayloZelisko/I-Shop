import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CategoriesService } from '../services/categories.service';
import { CategoryActions } from '../actions/category.actions';
import { catchError, map, of, switchMap } from 'rxjs';
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
}
