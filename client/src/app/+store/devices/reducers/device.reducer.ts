import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { DeviceActions } from '../actions/device.actions';
import { DeviceInterface } from '../../../shared/models/interfaces/device.interface';

export const devicesFeatureKey = 'devices';

export type State = EntityState<DeviceInterface>;

export const adapter: EntityAdapter<DeviceInterface> =
  createEntityAdapter<DeviceInterface>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export const reducer = createReducer(
  initialState,
  // on(DeviceActions.addDevice, (state, action) =>
  //   adapter.addOne(action.device, state),
  // ),
  // on(DeviceActions.upsertDevice, (state, action) =>
  //   adapter.upsertOne(action.device, state),
  // ),
  // on(DeviceActions.addDevices, (state, action) =>
  //   adapter.addMany(action.devices, state),
  // ),
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
  // on(DeviceActions.loadDevices, (state, action) =>
  //   adapter.setAll(action.devices, state),
  // ),
  // on(DeviceActions.clearDevices, (state) => adapter.removeAll(state)),
);
