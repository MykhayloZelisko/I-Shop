import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State, userFeatureKey } from '../reducers/user.reducer';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { RoleInterface } from '../../../shared/models/interfaces/role.interface';

export const selectUserState = createFeatureSelector<State>(userFeatureKey);

export const selectUser = createSelector(
  selectUserState,
  (state: State) => state.user,
);

export const selectAdmin = createSelector(
  selectUser,
  (user: UserInterface | null) =>
    user
      ? user.roles.some((role: RoleInterface) => role.role === 'administrator')
      : false,
);
