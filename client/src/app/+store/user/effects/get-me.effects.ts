import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { GetMeActions } from '../actions/get-me.actions';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';

@Injectable()
export class GetMeEffects {
  private actions$ = inject(Actions);

  private authService = inject(AuthService);

  public getMe$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GetMeActions.getMe),
      switchMap(() =>
        this.authService.getCurrentUser().pipe(
          map((user: UserInterface) => GetMeActions.getMeSuccess({ user })),
          catchError(() => of(GetMeActions.getMeFailure())),
        ),
      ),
    ),
  );
}
