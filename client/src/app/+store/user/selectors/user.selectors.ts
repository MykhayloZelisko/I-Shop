import { createFeatureSelector, createSelector } from '@ngrx/store';
import { userFeatureKey } from '../reducers/user.reducer';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { RoleInterface } from '../../../shared/models/interfaces/role.interface';

export const userSelector =
  createFeatureSelector<UserInterface>(userFeatureKey);

export const isAdminSelector = createSelector(
  userSelector,
  (user: UserInterface) =>
    user
      ? user.roles.some((role: RoleInterface) => role.role === 'administrator')
      : false,
);
