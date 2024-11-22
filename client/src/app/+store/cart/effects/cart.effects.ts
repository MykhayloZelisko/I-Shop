import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CartsService } from '../services/carts.service';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';
import { CartActions } from '../actions/cart.actions';
import {
  catchError,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { LoaderActions } from '../../loader/actions/loader.actions';
import { selectCartId } from '../selectors/cart.selectors';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);

  private cartsService = inject(CartsService);

  private store = inject(Store<State>);

  public checkCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.checkCart),
      withLatestFrom(this.store.select(selectCartId)),
      map(([action, cartId]) =>
        cartId
          ? CartActions.addCartDevice({ deviceId: action.deviceId, cartId })
          : CartActions.createCart({ deviceId: action.deviceId }),
      ),
    ),
  );

  public createCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.createCart),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.cartsService.createCart(action.deviceId).pipe(
          mergeMap((cart) => [
            LoaderActions.toggleLoader(),
            CartActions.createCartSuccess({ cart }),
          ]),
          catchError(() => {
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(CartActions.createCartFailure());
          }),
        ),
      ),
    ),
  );

  public createCartFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.createCartFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public addCartDevice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addCartDevice),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.cartsService.addDeviceToCart(action.deviceId, action.cartId).pipe(
          mergeMap((device) => [
            LoaderActions.toggleLoader(),
            CartActions.addCartDeviceSuccess({ device }),
          ]),
          catchError(() => {
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(CartActions.addCartDeviceFailure());
          }),
        ),
      ),
    ),
  );

  public addCartDeviceFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.addCartDeviceFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public deleteCartDevices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.deleteCartDevices),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.cartsService
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
              this.store.dispatch(LoaderActions.toggleLoader());
              return of(CartActions.deleteCartDevicesFailure());
            }),
          ),
      ),
    ),
  );

  public deleteCartDevicesFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.deleteCartDevicesFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public updateCartDevice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.updateCartDevice),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.cartsService.updateCartDevice(action.id, action.device).pipe(
          mergeMap((device) => [
            LoaderActions.toggleLoader(),
            CartActions.updateCartDeviceSuccess({ device }),
          ]),
          catchError(() => {
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(CartActions.updateCartDeviceFailure());
          }),
        ),
      ),
    ),
  );

  public updateCartDeviceFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.updateCartDeviceFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public updateCartDevices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.updateCartDevices),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.cartsService.updateCartDevices(action.payload).pipe(
          mergeMap((isInOrder) => [
            LoaderActions.toggleLoader(),
            CartActions.updateCartDevicesSuccess({ isInOrder }),
          ]),
          catchError(() => {
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(CartActions.updateCartDevicesFailure());
          }),
        ),
      ),
    ),
  );

  public updateCartDevicesFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.updateCartDevicesFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );
}
