import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CartsService } from '../services/carts.service';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';
import { CartActions } from '../actions/cart.actions';
import {
  catchError,
  debounceTime,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { LoaderActions } from '../../loader/actions/loader.actions';
import { selectCartId } from '../selectors/cart.selectors';

export const checkCart$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store<State>)) =>
    actions$.pipe(
      ofType(CartActions.checkCart),
      withLatestFrom(store.select(selectCartId)),
      map(([action, cartId]) =>
        cartId
          ? CartActions.addCartDevice({ deviceId: action.deviceId, cartId })
          : CartActions.createCart({ deviceId: action.deviceId }),
      ),
    ),
  { functional: true },
);

export const createCart$ = createEffect(
  (
    actions$ = inject(Actions),
    cartsService = inject(CartsService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CartActions.createCart),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        cartsService.createCart(action.deviceId).pipe(
          mergeMap((cart) => [
            LoaderActions.toggleLoader(),
            CartActions.createCartSuccess({ cart }),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(CartActions.createCartFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const createCartFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CartActions.createCartFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const addCartDevice$ = createEffect(
  (
    actions$ = inject(Actions),
    cartsService = inject(CartsService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CartActions.addCartDevice),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        cartsService.addDeviceToCart(action.deviceId, action.cartId).pipe(
          mergeMap((device) => [
            LoaderActions.toggleLoader(),
            CartActions.addCartDeviceSuccess({ device }),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(CartActions.addCartDeviceFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const addCartDeviceFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CartActions.addCartDeviceFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const deleteCartDevices$ = createEffect(
  (
    actions$ = inject(Actions),
    cartsService = inject(CartsService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CartActions.deleteCartDevices),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        cartsService
          .deleteDevicesFromCart(action.deviceIds, action.cartId)
          .pipe(
            mergeMap((response) => {
              const actions: ReturnType<
                | typeof CartActions.deleteCartDevicesSuccess
                | typeof CartActions.clearCart
                | typeof LoaderActions.toggleLoader
              >[] = [
                LoaderActions.toggleLoader(),
                CartActions.deleteCartDevicesSuccess({ ids: response.ids }),
              ];
              if (response.cart) {
                actions.push(CartActions.clearCart());
              }
              return actions;
            }),
            catchError(() => {
              store.dispatch(LoaderActions.toggleLoader());
              return of(CartActions.deleteCartDevicesFailure());
            }),
          ),
      ),
    ),
  { functional: true },
);

export const deleteCartDevicesFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CartActions.deleteCartDevicesFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const updateCartDevice$ = createEffect(
  (
    actions$ = inject(Actions),
    cartsService = inject(CartsService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CartActions.updateCartDevice),
      debounceTime(500),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        cartsService.updateCartDevice(action.id, action.device).pipe(
          mergeMap((device) => [
            LoaderActions.toggleLoader(),
            CartActions.updateCartDeviceSuccess({ device }),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(CartActions.updateCartDeviceFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const updateCartDeviceFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CartActions.updateCartDeviceFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const updateCartDevices$ = createEffect(
  (
    actions$ = inject(Actions),
    cartsService = inject(CartsService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CartActions.updateCartDevices),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        cartsService.updateCartDevices(action.payload).pipe(
          mergeMap((isInOrder) => [
            LoaderActions.toggleLoader(),
            CartActions.updateCartDevicesSuccess({ isInOrder }),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(CartActions.updateCartDevicesFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const updateCartDevicesFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CartActions.updateCartDevicesFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const loadCart$ = createEffect(
  (
    actions$ = inject(Actions),
    cartsService = inject(CartsService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(CartActions.loadCart),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        cartsService.getGuestCart(action.id).pipe(
          mergeMap((cart) => [
            LoaderActions.toggleLoader(),
            CartActions.loadCartSuccess({ cart }),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(CartActions.loadCartFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const loadCartFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CartActions.loadCartFailure),
      tap(() => {
        localStorage.removeItem('cartId');
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const clearCart$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CartActions.clearCart),
      tap(() => {
        localStorage.removeItem('cartId');
      }),
    ),
  { dispatch: false, functional: true },
);
