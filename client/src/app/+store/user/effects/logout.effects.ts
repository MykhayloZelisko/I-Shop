import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../services/auth.service';
import { LogoutActions } from '../actions/logout.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';

@Injectable()
export class LogoutEffects {
  private actions$ = inject(Actions);

  private authService = inject(AuthService);

  public logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LogoutActions.logout),
      switchMap(() =>
        this.authService.logout().pipe(
          map(() => LogoutActions.logoutSuccess()),
          catchError(() => of(LogoutActions.logoutFailure())),
        ),
      ),
    ),
  );

  public logoutFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LogoutActions.logoutFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );
}
