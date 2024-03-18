import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RegistrationActions } from '../actions/registration.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AuthDialogActions } from '../../auth-dialog/actions/auth-dialog.actions';
import { AuthDialogTypeEnum } from '../../../shared/models/enums/auth-dialog-type.enum';

@Injectable()
export class RegistrationEffects {
  private actions$ = inject(Actions);

  private authService = inject(AuthService);

  private router = inject(Router);

  public registration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegistrationActions.registration),
      switchMap((action) =>
        this.authService.registration(action.registration).pipe(
          map(() => RegistrationActions.registrationSuccess()),
          catchError(() => of(RegistrationActions.registrationFailure())),
        ),
      ),
    ),
  );

  public registrationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegistrationActions.registrationSuccess),
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
        ofType(RegistrationActions.registrationFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );
}
