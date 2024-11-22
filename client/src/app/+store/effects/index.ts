import { AuthEffects } from '../auth/effects/auth.effects';
import { CategoryEffects } from '../categories/effects/category.effects';
import { BrandEffects } from '../brands/effects/brand.effects';
import { DeviceEffects } from '../devices/effects/device.effects';
import { CPropertiesGroupEffects } from '../c-properties-groups/effects/c-properties-group.effects';
import { CPropertyEffects } from '../c-properties/effects/c-property.effects';
import { SharedEffects } from '../shared/effects/shared.effects';
import { CommentEffects } from '../comments/effects/comment.effects';
import { CartEffects } from '../cart/effects/cart.effects';

export const AppEffects = [
  AuthEffects,
  CategoryEffects,
  BrandEffects,
  DeviceEffects,
  CPropertiesGroupEffects,
  CPropertyEffects,
  SharedEffects,
  CommentEffects,
  CartEffects,
];
