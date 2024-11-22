import { CartDeviceInterface } from './cart-device.interface';

export interface CartInterface {
  id: string;
  devices: CartDeviceInterface[];
}
