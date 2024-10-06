// import {
//   createFeature,
//   createFeatureSelector,
//   createSelector,
// } from '@ngrx/store';
// import {
//   adapter,
//   devicesFeatureKey,
//   reducer,
//   State,
// } from '../reducers/device.reducer';
// import { selectIdAndPage } from '../../router/selectors/router.selectors';
// import { DeviceInterface } from '../../../shared/models/interfaces/device.interface';
// import { RouterParamsInterface } from '../../../shared/models/interfaces/router-params.interface';
//
// const selectDeviceState = createFeatureSelector<State>(devicesFeatureKey);
//
// export const devicesFeature = createFeature({
//   name: devicesFeatureKey,
//   reducer,
//   extraSelectors: ({ selectDevicesState }) => ({
//     ...adapter.getSelectors(selectDevicesState),
//   }),
// });
//
// export const selectAllDevices = devicesFeature.selectAll;
//
// export const selectEntitiesDevices = devicesFeature.selectEntities;
//
// export const selectIdsDevices = devicesFeature.selectIds;
//
// export const selectTotalDevices = devicesFeature.selectTotal;
//
// export const selectPaginationParams = createSelector(
//   selectDeviceState,
//   (state: State) => ({
//     total: state.total,
//     currentPage: state.currentPage,
//     size: state.size,
//     maxPage: state.maxPage,
//   }),
// );
//
// export const selectDevice = createSelector(
//   selectDeviceState,
//   (state: State) => state.currentDevice,
// );
//
// export const selectIsCurrentDevice = createSelector(
//   selectDevice,
//   selectIdAndPage,
//   (device: DeviceInterface | null, params: RouterParamsInterface) => {
//     return {
//       isCurrent: !!device && device.id === params.id,
//       id: params.id,
//     };
//   },
// );
