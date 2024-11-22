import { DPropertiesGroupInterface } from './d-properties-group.interface';

export interface CreateDeviceInterface {
  deviceName: string;
  price: number;
  quantity: number;
  images: string[];
  categoryId: string;
  brandId: string;
  groups: DPropertiesGroupInterface[];
}
