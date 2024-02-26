import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RegistrationActions } from '../actions/registration.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class RegistrationEffects {
  public registration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegistrationActions.registration),
      switchMap((action) =>
        this.authService.registration(action).pipe(
          map(() => RegistrationActions.registrationSuccess()),
          catchError(() => of(RegistrationActions.registrationFailure())),
        ),
      ),
    ),
  );

  public registrationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RegistrationActions.registrationSuccess),
        tap(() => this.router.navigateByUrl('/')),
      ),
    { dispatch: false },
  );

  public registrationFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RegistrationActions.registrationFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );

  public constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
  ) {}
}
