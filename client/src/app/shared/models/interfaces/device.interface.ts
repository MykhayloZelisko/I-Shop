import { CategoryInterface } from './category.interface';
import { BrandInterface } from './brand.interface';
import { DPropertiesGroupInterface } from './d-properties-group.interface';

export interface DeviceInterface {
  id: string;
  deviceName: string;
  price: number;
  quantity: number;
  rating: number;
  votes: number;
  images: string[];
  categories: CategoryInterface[];
  category: CategoryInterface;
  brand: BrandInterface;
  groups: DPropertiesGroupInterface[];
}
