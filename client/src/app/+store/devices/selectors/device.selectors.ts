import {
  createFeature,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import {
  adapter,
  devicesFeatureKey,
  reducer,
  State,
} from '../reducers/device.reducer';

const selectDeviceState = createFeatureSelector<State>(devicesFeatureKey);

export const devicesFeature = createFeature({
  name: devicesFeatureKey,
  reducer,
  extraSelectors: ({ selectDevicesState }) => ({
    ...adapter.getSelectors(selectDevicesState),
  }),
});

export const selectAllDevices = devicesFeature.selectAll;

export const selectEntitiesDevices = devicesFeature.selectEntities;

export const selectIdsDevices = devicesFeature.selectIds;

export const selectTotalDevices = devicesFeature.selectTotal;

export const selectPaginationParams = createSelector(
  selectDeviceState,
  (state: State) => ({
    total: state.total,
    currentPage: state.currentPage,
    size: state.size,
    maxPage: state.maxPage,
  }),
);

export const selectDevice = createSelector(
  selectDeviceState,
  (state: State) => state.currentDevice,
);
