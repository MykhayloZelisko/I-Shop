import { RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterStateUrlInterface } from '../serializer/custom-route-serializer';

export const selectRouter =
  createFeatureSelector<RouterReducerState<RouterStateUrlInterface>>('router');

export const selectId = createSelector(
  selectRouter,
  (state: RouterReducerState<RouterStateUrlInterface>): string | null => {
    return state.state.params['id'] ?? null;
  },
);
// export const {
//   selectCurrentRoute, // select the current route
//   selectFragment, // select the current route fragment
//   selectQueryParams, // select the current route query params
//   selectQueryParam, // factory function to select a query param
//   selectRouteParams, // select the current route params
//   selectRouteParam, // factory function to select a route param
//   selectRouteData, // select the current route data
//   selectRouteDataParam, // factory function to select a route data param
//   selectUrl, // select the current url
//   selectTitle, // select the title if available
// } = getRouterSelectors();
