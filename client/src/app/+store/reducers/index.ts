import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { reducer as userReducer } from '../user/reducers/user.reducer';
import { UserInterface } from '../../shared/models/interfaces/user.interface';

export interface State {
  user: UserInterface | null;
}

export const reducers: ActionReducerMap<State> = {
  user: userReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
