import { AuthEffects } from '../auth/effects/auth.effects';
import { CategoryEffects } from '../categories/effects/category.effects';
import { BrandEffects } from '../brands/effects/brand.effects';
import { DeviceEffects } from '../devices/effects/device.effects';

export const AppEffects = [
  AuthEffects,
  CategoryEffects,
  BrandEffects,
  DeviceEffects,
];
