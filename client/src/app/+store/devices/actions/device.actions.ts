import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { CreateDeviceInterface } from '../../../shared/models/interfaces/create-device.interface';
import { DevicesListInterface } from '../../../shared/models/interfaces/devices-list.interface';
import { DeviceInterface } from '../../../shared/models/interfaces/device.interface';

export const DeviceActions = createActionGroup({
  source: 'Device/API',
  events: {
    // entity actions
    LoadDevices: props<{ id: string; page: number; size: number }>(),
    LoadDevicesSuccess: props<{ devicesList: DevicesListInterface }>(),
    LoadDevicesFailure: emptyProps(),
    // 'Add Device': props<{ device: Device }>(),
    // 'Upsert Device': props<{ device: Device }>(),
    AddDevices: props<{ id: string; page: number; size: number }>(),
    AddDevicesSuccess: props<{ devicesList: DevicesListInterface }>(),
    AddDevicesFailure: emptyProps(),
    // 'Upsert Devices': props<{ devices: Device[] }>(),
    // 'Update Device': props<{ device: Update<Device> }>(),
    // 'Update Devices': props<{ devices: Update<Device>[] }>(),
    // 'Delete Device': props<{ id: string }>(),
    // 'Delete Devices': props<{ ids: string[] }>(),
    // ClearDevices: emptyProps(),
    // other actions
    CreateDevice: props<{ device: CreateDeviceInterface }>(),
    CreateDeviceSuccess: emptyProps(),
    CreateDeviceFailure: emptyProps(),
    LoadDevice: props<{ id: string }>(),
    LoadDeviceSuccess: props<{ device: DeviceInterface }>(),
    LoadDeviceFailure: emptyProps(),
  },
});
