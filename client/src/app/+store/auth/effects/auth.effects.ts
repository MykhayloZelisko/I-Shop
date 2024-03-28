import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { AuthDialogActions } from '../../auth-dialog/actions/auth-dialog.actions';
import { AuthDialogTypeEnum } from '../../../shared/models/enums/auth-dialog-type.enum';
import { LayoutRouteNameEnum } from '../../../shared/models/enums/layout-route-name.enum';
import { UserRouteNameEnum } from '../../../shared/models/enums/user-route-name.enum';
import { Router } from '@angular/router';
import { AuthActions } from '../actions/auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);

  private authService = inject(AuthService);

  private router = inject(Router);

  // GetMe
  public getMe$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getMe),
      switchMap(() =>
        this.authService.getCurrentUser().pipe(
          map((user: UserInterface) => AuthActions.getMeSuccess({ user })),
          catchError(() => of(AuthActions.getMeFailure())),
        ),
      ),
    ),
  );

  // Login
  public login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap((action) =>
        this.authService.login(action.login).pipe(
          mergeMap((user: UserInterface) => [
            AuthActions.loginSuccess({ user }),
            AuthDialogActions.authDialog({
              dialog: {
                title: '',
                dialogType: AuthDialogTypeEnum.None,
              },
            }),
          ]),
          catchError(() => of(AuthActions.loginFailure())),
        ),
      ),
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
      switchMap(() =>
        this.authService.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError(() => of(AuthActions.logoutFailure())),
        ),
      ),
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
      switchMap((action) =>
        this.authService.registration(action.registration).pipe(
          map(() => AuthActions.registrationSuccess()),
          catchError(() => of(AuthActions.registrationFailure())),
        ),
      ),
    ),
  );

  public registrationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registrationSuccess),
      map(() =>
        AuthDialogActions.authDialog({
          dialog: {
            title: 'Вхід',
            dialogType: AuthDialogTypeEnum.Login,
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
