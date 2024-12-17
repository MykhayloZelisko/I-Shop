import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';
import { catchError, mergeMap, of, switchMap, tap } from 'rxjs';
import { LoaderActions } from '../../loader/actions/loader.actions';
import { BrandsService } from '../services/brands.service';
import { BrandActions } from '../actions/brand.actions';
import { BrandInterface } from '../../../shared/models/interfaces/brand.interface';
import { FormActions } from '../../form/actions/form.actions';

export const loadBrands$ = createEffect(
  (
    actions$ = inject(Actions),
    brandsService = inject(BrandsService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(BrandActions.loadBrands),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap(() =>
        brandsService.getAllBrands().pipe(
          mergeMap((brands: BrandInterface[]) => [
            LoaderActions.toggleLoader(),
            BrandActions.loadBrandsSuccess({ brands }),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(BrandActions.loadBrandsFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const loadBrandsFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(BrandActions.loadBrandsFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const addBrand$ = createEffect(
  (
    actions$ = inject(Actions),
    brandsService = inject(BrandsService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(BrandActions.addBrand),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        brandsService.createBrand(action.brandName).pipe(
          mergeMap((brand) => [
            LoaderActions.toggleLoader(),
            BrandActions.addBrandSuccess({ brand }),
            FormActions.clearFormOn(),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(BrandActions.addBrandFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const addBrandFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(BrandActions.addBrandFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const deleteBrand$ = createEffect(
  (
    actions$ = inject(Actions),
    brandsService = inject(BrandsService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(BrandActions.deleteBrand),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        brandsService.deleteBrand(action.id).pipe(
          mergeMap((id) => [
            LoaderActions.toggleLoader(),
            BrandActions.deleteBrandSuccess({ id }),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(BrandActions.deleteBrandFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const deleteBrandFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(BrandActions.deleteBrandFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const updateBrand$ = createEffect(
  (
    actions$ = inject(Actions),
    brandsService = inject(BrandsService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(BrandActions.updateBrand),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        brandsService.updateBrand(action.id, action.brandName).pipe(
          mergeMap((brand) => [
            LoaderActions.toggleLoader(),
            BrandActions.updateBrandSuccess({ brand }),
            BrandActions.clearCurrentBrandId(),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(BrandActions.updateBrandFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const updateBrandFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(BrandActions.updateBrandFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);
