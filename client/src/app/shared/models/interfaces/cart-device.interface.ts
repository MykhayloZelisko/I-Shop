import { DeviceInterface } from './device.interface';

export interface CartDeviceInterface {
  id: string;
  device: DeviceInterface;
  quantity: number;
  priceAtAdd: number;
  isInOrder: boolean;
}
