import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { DeviceActions } from '../actions/device.actions';
import { DeviceInterface } from '../../../shared/models/interfaces/device.interface';
import { DEVICES_PAGE_SIZE } from '../../../shared/models/constants/page-size';
import { UpdateStr } from '@ngrx/entity/src/models';

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
  size: DEVICES_PAGE_SIZE,
  maxPage: 0,
  currentDevice: null,
});

export const reducer = createReducer(
  initialState,
  // entity actions
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
  // on(DeviceActions.updateDevice, (state, action) =>
  //   adapter.updateOne(action.device, state),
  // ),
  // on(DeviceActions.deleteDevice, (state, action) =>
  //   adapter.removeOne(action.id, state),
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
  // other actions
  on(DeviceActions.loadDeviceSuccess, (state, action) => ({
    ...state,
    currentDevice: action.device,
  })),
  on(DeviceActions.updateCurrentDeviceRating, (state, action) => {
    if (state.currentDevice) {
      return {
        ...state,
        currentDevice: {
          ...state.currentDevice,
          votes: action.votes,
          rating: action.rating,
        },
      };
    } else {
      return state;
    }
  }),
);
