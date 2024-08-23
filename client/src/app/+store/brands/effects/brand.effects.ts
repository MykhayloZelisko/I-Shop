import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';
import { catchError, mergeMap, of, switchMap, tap } from 'rxjs';
import { LoaderActions } from '../../loader/actions/loader.actions';
import { BrandsService } from '../services/brands.service';
import { BrandActions } from '../actions/brand.actions';
import { BrandInterface } from '../../../shared/models/interfaces/brand.interface';
import { FormActions } from '../../form/actions/form.actions';

@Injectable()
export class BrandEffects {
  private actions$ = inject(Actions);

  private brandsService = inject(BrandsService);

  private store = inject(Store<State>);

  public loadBrands$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BrandActions.loadBrands),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap(() =>
        this.brandsService.getAllBrands().pipe(
          mergeMap((brands: BrandInterface[]) => [
            LoaderActions.toggleLoader(),
            BrandActions.loadBrandsSuccess({ brands }),
          ]),
          catchError(() => {
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(BrandActions.loadBrandsFailure());
          }),
        ),
      ),
    ),
  );

  public loadBrandsFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BrandActions.loadBrandsFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public addBrand$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BrandActions.addBrand),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.brandsService.createBrand(action.brandName).pipe(
          mergeMap((brand) => [
            LoaderActions.toggleLoader(),
            BrandActions.addBrandSuccess({ brand }),
            FormActions.clearFormOn(),
          ]),
          catchError(() => {
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(BrandActions.addBrandFailure());
          }),
        ),
      ),
    ),
  );

  public addBrandFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BrandActions.addBrandFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public deleteBrand$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BrandActions.deleteBrand),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.brandsService.deleteBrand(action.id).pipe(
          mergeMap((id) => [
            LoaderActions.toggleLoader(),
            BrandActions.deleteBrandSuccess({ id }),
          ]),
          catchError(() => {
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(BrandActions.deleteBrandFailure());
          }),
        ),
      ),
    ),
  );

  public deleteBrandFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BrandActions.deleteBrandFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public updateBrand$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BrandActions.updateBrand),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.brandsService.updateBrand(action.id, action.brandName).pipe(
          mergeMap((brand) => [
            LoaderActions.toggleLoader(),
            BrandActions.updateBrandSuccess({ brand }),
            BrandActions.clearCurrentBrandId(),
          ]),
          catchError(() => {
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(BrandActions.updateBrandFailure());
          }),
        ),
      ),
    ),
  );

  public updateBrandFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BrandActions.updateBrandFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );
}
