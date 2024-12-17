import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { PopupTypeEnum } from '../../../shared/models/enums/popup-type.enum';
import { LayoutRouteNameEnum } from '../../../shared/models/enums/layout-route-name.enum';
import { UserRouteNameEnum } from '../../../shared/models/enums/user-route-name.enum';
import { Router } from '@angular/router';
import { AuthActions } from '../actions/auth.actions';
import { State } from '../../reducers';
import { Store } from '@ngrx/store';
import { LoaderActions } from '../../loader/actions/loader.actions';
import { PopupActions } from '../../popup/actions/popup.actions';
import { CartActions } from '../../cart/actions/cart.actions';

// GetMe
export const getMe$ = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(AuthActions.getMe),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap(() =>
        authService.getCurrentUser().pipe(
          mergeMap((user: UserInterface) => {
            const actions: ReturnType<
              | typeof CartActions.loadCart
              | typeof AuthActions.getMeSuccess
              | typeof LoaderActions.toggleLoader
            >[] = [
              LoaderActions.toggleLoader(),
              AuthActions.getMeSuccess({ user }),
            ];

            if (user.cart) {
              actions.push(CartActions.loadCart({ cart: user.cart }));
            }

            return actions;
          }),
        ),
      ),
      catchError(() => {
        store.dispatch(LoaderActions.toggleLoader());
        return of(AuthActions.getMeFailure());
      }),
    ),
  { functional: true },
);

// Login
export const login$ = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(AuthActions.login),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        authService.login(action.login).pipe(
          mergeMap((user: UserInterface) => {
            const actions: ReturnType<
              | typeof CartActions.loadCart
              | typeof AuthActions.loginSuccess
              | typeof LoaderActions.toggleLoader
              | typeof PopupActions.closePopup
            >[] = [
              LoaderActions.toggleLoader(),
              AuthActions.loginSuccess({ user }),
              PopupActions.closePopup(),
            ];

            if (user.cart) {
              actions.push(CartActions.loadCart({ cart: user.cart }));
            }

            return actions;
          }),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(AuthActions.loginFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const loginFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AuthActions.loginFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

// Logout
export const logout$ = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap(() =>
        authService.logout().pipe(
          mergeMap(() => [
            LoaderActions.toggleLoader(),
            AuthActions.logoutSuccess(),
            CartActions.clearCart(),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(AuthActions.logoutFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const logoutFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AuthActions.logoutFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);

export const logoutSuccess$ = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
      ofType(AuthActions.logoutSuccess),
      tap(() => {
        if (router.url.includes(LayoutRouteNameEnum.Admin)) {
          router.navigateByUrl(UserRouteNameEnum.Home);
        }
      }),
    ),
  { dispatch: false, functional: true },
);

// Registration
export const registration$ = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
    store = inject(Store<State>),
  ) =>
    actions$.pipe(
      ofType(AuthActions.registration),
      tap(() => store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        authService.registration(action.registration).pipe(
          mergeMap(() => [
            LoaderActions.toggleLoader(),
            AuthActions.registrationSuccess(),
          ]),
          catchError(() => {
            store.dispatch(LoaderActions.toggleLoader());
            return of(AuthActions.registrationFailure());
          }),
        ),
      ),
    ),
  { functional: true },
);

export const registrationSuccess$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AuthActions.registrationSuccess),
      map(() =>
        PopupActions.openPopup({
          popup: {
            title: 'Вхід',
            popupType: PopupTypeEnum.Login,
          },
        }),
      ),
    ),
  { functional: true },
);

export const registrationFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AuthActions.registrationFailure),
      tap(() => {
        // TODO: add dialog
      }),
    ),
  { dispatch: false, functional: true },
);
