import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LoginActions } from '../actions/login.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';

@Injectable()
export class LoginEffects {
  public login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginActions.login),
      switchMap((action) =>
        this.authService.login(action).pipe(
          map((user: UserInterface) => LoginActions.loginSuccess(user)),
          catchError(() => of(LoginActions.loginFailure())),
        ),
      ),
    ),
  );

  public loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LoginActions.loginFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public constructor(
    private actions$: Actions,
    private authService: AuthService,
  ) {}
}
