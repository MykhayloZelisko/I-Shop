import { DeviceInterface } from './device.interface';

export interface DevicesListInterface {
  total: number;
  page: number;
  size: number;
  devices: DeviceInterface[];
}
