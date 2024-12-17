import * as authEffects from '../auth/effects/auth.effects';
import * as categoryEffects from '../categories/effects/category.effects';
import * as brandEffects from '../brands/effects/brand.effects';
import * as deviceEffects from '../devices/effects/device.effects';
import * as cPropertiesGroupEffects from '../c-properties-groups/effects/c-properties-group.effects';
import * as cPropertyEffects from '../c-properties/effects/c-property.effects';
import * as sharedEffects from '../shared/effects/shared.effects';
import * as commentEffects from '../comments/effects/comment.effects';
import * as cartEffects from '../cart/effects/cart.effects';

export const AppEffects = [
  authEffects,
  categoryEffects,
  brandEffects,
  deviceEffects,
  cPropertiesGroupEffects,
  cPropertyEffects,
  sharedEffects,
  commentEffects,
  cartEffects,
];
