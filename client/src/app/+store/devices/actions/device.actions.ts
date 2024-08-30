import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { CreateDeviceInterface } from '../../../shared/models/interfaces/create-device.interface';

export const DeviceActions = createActionGroup({
  source: 'Device/API',
  events: {
    // entity actions
    // 'Load Devices': props<{ devices: Device[] }>(),
    // 'Add Device': props<{ device: Device }>(),
    // 'Upsert Device': props<{ device: Device }>(),
    // 'Add Devices': props<{ devices: Device[] }>(),
    // 'Upsert Devices': props<{ devices: Device[] }>(),
    // 'Update Device': props<{ device: Update<Device> }>(),
    // 'Update Devices': props<{ devices: Update<Device>[] }>(),
    // 'Delete Device': props<{ id: string }>(),
    // 'Delete Devices': props<{ ids: string[] }>(),
    // 'Clear Devices': emptyProps(),
    // other actions
    CreateDevice: props<{ device: CreateDeviceInterface }>(),
    CreateDeviceSuccess: emptyProps(),
    CreateDeviceFailure: emptyProps(),
  },
});
