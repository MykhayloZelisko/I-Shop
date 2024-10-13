import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SharedService } from '../services/shared.service';
import { catchError, mergeMap, of, switchMap, tap } from 'rxjs';
import { LoaderActions } from '../../loader/actions/loader.actions';
import { State } from '../../reducers';
import { Store } from '@ngrx/store';
import { SharedActions } from '../actions/shared.actions';
import { CPropertyActions } from '../../c-properties/actions/c-property.actions';
import { CPropertiesGroupActions } from '../../c-properties-groups/actions/c-properties-group.actions';
import { GPInterface } from '../../../shared/models/interfaces/g-p.interface';

@Injectable()
export class SharedEffects {
  private actions$ = inject(Actions);

  private sharedService = inject(SharedService);

  private store = inject(Store<State>);

  public addGroupsWithProperties$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SharedActions.addGroupsWithProperties),
      tap(() => this.store.dispatch(LoaderActions.toggleLoader())),
      switchMap((action) =>
        this.sharedService.getGroupsWithProperties(action.id).pipe(
          mergeMap((response: GPInterface) => [
            LoaderActions.toggleLoader(),
            CPropertiesGroupActions.addCPropertiesGroupsSuccess({
              groups: response.groups,
            }),
            CPropertyActions.addCPropertiesSuccess({
              properties: response.properties,
            }),
          ]),
          catchError(() => {
            this.store.dispatch(LoaderActions.toggleLoader());
            return of(SharedActions.addGroupsWithPropertiesFailure());
          }),
        ),
      ),
    ),
  );

  public addGroupsWithPropertiesFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SharedActions.addGroupsWithPropertiesFailure),
        tap(() => {
          // TODO: add dialog
        }),
      ),
    { dispatch: false },
  );
}
