import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LoginActions } from '../actions/login.actions';
import { catchError, mergeMap, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { AuthDialogActions } from '../../auth-dialog/actions/auth-dialog.actions';
import { AuthDialogTypeEnum } from '../../../shared/models/enums/auth-dialog-type.enum';

@Injectable()
export class LoginEffects {
  private actions$ = inject(Actions);

  private authService = inject(AuthService);

  public login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginActions.login),
      switchMap((action) =>
        this.authService.login(action.login).pipe(
          mergeMap((user: UserInterface) => [
            LoginActions.loginSuccess({ user }),
            AuthDialogActions.authDialog({
              dialog: {
                title: '',
                dialogType: AuthDialogTypeEnum.None,
              },
            }),
          ]),
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
}
