import {
  createFeature,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
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

export const { selectIds, selectEntities, selectAll, selectTotal } =
  devicesFeature;
