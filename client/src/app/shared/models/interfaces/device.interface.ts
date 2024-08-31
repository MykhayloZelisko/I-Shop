import { CategoryInterface } from './category.interface';
import { BrandInterface } from './brand.interface';
import { DPropertyInterface } from './d-property.interface';

export interface DeviceInterface {
  id: string;
  deviceName: string;
  price: number;
  count: number;
  rating: number;
  votes: number;
  images: string[];
  categories: CategoryInterface[];
  category: CategoryInterface;
  brand: BrandInterface;
  properties: DPropertyInterface[];
}
