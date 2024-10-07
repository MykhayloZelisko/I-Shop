import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { DeviceActions } from '../actions/device.actions';
import { DeviceInterface } from '../../../shared/models/interfaces/device.interface';
import { PAGE_SIZE } from '../../../shared/models/constants/page-size';

export const devicesFeatureKey = 'devices';

export interface State extends EntityState<DeviceInterface> {
  total: number;
  currentPage: number;
  size: number;
  maxPage: number;
  currentDevice: DeviceInterface | null;
}

export const adapter: EntityAdapter<DeviceInterface> =
  createEntityAdapter<DeviceInterface>();

export const initialState: State = adapter.getInitialState({
  total: 0,
  currentPage: 0,
  size: PAGE_SIZE,
  maxPage: 0,
  currentDevice: null,
});

export const reducer = createReducer(
  initialState,
  // entity actions
  // on(DeviceActions.addDevice, (state, action) =>
  //   adapter.addOne(action.device, state),
  // ),
  // on(DeviceActions.upsertDevice, (state, action) =>
  //   adapter.upsertOne(action.device, state),
  // ),
  on(DeviceActions.addDevicesSuccess, (state, action) => {
    const updatedState = adapter.addMany(action.devicesList.devices, state);
    return {
      ...state,
      ...updatedState,
      total: action.devicesList.total,
      currentPage: action.devicesList.page,
      size: action.devicesList.size,
      maxPage: Math.ceil(action.devicesList.total / action.devicesList.size),
    };
  }),
  // on(DeviceActions.upsertDevices, (state, action) =>
  //   adapter.upsertMany(action.devices, state),
  // ),
  // on(DeviceActions.updateDevice, (state, action) =>
  //   adapter.updateOne(action.device, state),
  // ),
  // on(DeviceActions.updateDevices, (state, action) =>
  //   adapter.updateMany(action.devices, state),
  // ),
  // on(DeviceActions.deleteDevice, (state, action) =>
  //   adapter.removeOne(action.id, state),
  // ),
  // on(DeviceActions.deleteDevices, (state, action) =>
  //   adapter.removeMany(action.ids, state),
  // ),
  on(DeviceActions.loadDevicesSuccess, (state, action) => {
    const updatedState = adapter.setAll(action.devicesList.devices, state);
    return {
      ...state,
      ...updatedState,
      total: action.devicesList.total,
      currentPage: action.devicesList.page,
      size: action.devicesList.size,
      maxPage: Math.ceil(action.devicesList.total / action.devicesList.size),
    };
  }),
  // on(DeviceActions.clearDevices, (state) => adapter.removeAll(state)),
  // other actions
  on(DeviceActions.loadDeviceSuccess, (state, action) => ({
    ...state,
    currentDevice: action.device,
  })),
);
