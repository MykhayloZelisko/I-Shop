import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { DialogActions } from '../../dialog/actions/dialog.actions';
import { DialogTypeEnum } from '../../../shared/models/enums/dialog-type.enum';
import { LayoutRouteNameEnum } from '../../../shared/models/enums/layout-route-name.enum';
import { UserRouteNameEnum } from '../../../shared/models/enums/user-route-name.enum';
import { Router } from '@angular/router';
import { AuthActions } from '../actions/auth.actions';
import { State } from '../../reducers';
import { Store } from '@ngrx/store';
import { LoaderActions } from '../../loader/actions/loader.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);

  private authService = inject(AuthService);

  private router = inject(Router);

  private store = inject(Store<State>);

  // GetMe
  public getMe$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getMe),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap(() => this.authService.getCurrentUser()),
      mergeMap((user: UserInterface) => [
        LoaderActions.toggleLoader(),
        AuthActions.getMeSuccess({ user }),
      ]),
      catchError(() => {
        this.store.dispatch(LoaderActions.toggleLoader());
        return of(AuthActions.getMeFailure());
      }),
    ),
  );

  // Login
  public login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) => this.authService.login(action.login)),
      mergeMap((user: UserInterface) => [
        LoaderActions.toggleLoader(),
        AuthActions.loginSuccess({ user }),
        DialogActions.openDialog({
          dialog: {
            title: '',
            dialogType: DialogTypeEnum.None,
          },
        }),
      ]),
      catchError(() => {
        this.store.dispatch(LoaderActions.toggleLoader());
        return of(AuthActions.loginFailure());
      }),
    ),
  );

  public loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  // Logout
  public logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap(() => this.authService.logout()),
      mergeMap(() => [
        LoaderActions.toggleLoader(),
        AuthActions.logoutSuccess(),
      ]),
      catchError(() => {
        this.store.dispatch(LoaderActions.toggleLoader());
        return of(AuthActions.logoutFailure());
      }),
    ),
  );

  public logoutFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          if (this.router.url.includes(LayoutRouteNameEnum.Admin)) {
            this.router.navigateByUrl(UserRouteNameEnum.Home);
          }
        }),
      ),
    { dispatch: false },
  );

  // Registration
  public registration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registration),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) => this.authService.registration(action.registration)),
      mergeMap(() => [
        LoaderActions.toggleLoader(),
        AuthActions.registrationSuccess(),
      ]),
      catchError(() => {
        this.store.dispatch(LoaderActions.toggleLoader());
        return of(AuthActions.registrationFailure());
      }),
    ),
  );

  public registrationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registrationSuccess),
      map(() =>
        DialogActions.openDialog({
          dialog: {
            title: 'Вхід',
            dialogType: DialogTypeEnum.Login,
          },
        }),
      ),
    ),
  );

  public registrationFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registrationFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );
}
