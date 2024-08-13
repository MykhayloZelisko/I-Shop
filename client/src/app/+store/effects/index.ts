import { AuthEffects } from '../auth/effects/auth.effects';
import { CategoryEffects } from '../categories/effects/category.effects';
import { BrandEffects } from '../brands/effects/brand.effects';

export const AppEffects = [AuthEffects, CategoryEffects, BrandEffects];
