import { createFeature } from '@ngrx/store';
import {
  adapter,
  devicesFeatureKey,
  reducer,
} from '../reducers/device.reducer';

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
