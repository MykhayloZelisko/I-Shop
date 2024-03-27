import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State, userFeatureKey } from '../reducers/user.reducer';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { RoleInterface } from '../../../shared/models/interfaces/role.interface';

export const userStateSelector = createFeatureSelector<State>(userFeatureKey);

export const userSelector = createSelector(
  userStateSelector,
  (state: State) => state.user,
);

export const isAdminSelector = createSelector(
  userSelector,
  (user: UserInterface | null) =>
    user
      ? user.roles.some((role: RoleInterface) => role.role === 'administrator')
      : false,
);
