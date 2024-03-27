import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../services/auth.service';
import { LogoutActions } from '../actions/logout.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LayoutRouteNameEnum } from '../../../shared/models/enums/layout-route-name.enum';
import { UserRouteNameEnum } from '../../../shared/models/enums/user-route-name.enum';

@Injectable()
export class LogoutEffects {
  private actions$ = inject(Actions);

  private authService = inject(AuthService);

  private router = inject(Router);

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

  public logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LogoutActions.logoutSuccess),
        tap(() => {
          if (this.router.url.includes(LayoutRouteNameEnum.Admin)) {
            this.router.navigateByUrl(UserRouteNameEnum.Home);
          }
        }),
      ),
    { dispatch: false },
  );
}
