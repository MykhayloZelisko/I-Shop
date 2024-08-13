import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { BrandInterface } from '../../../shared/models/interfaces/brand.interface';

export const BrandActions = createActionGroup({
  source: 'Brand/API',
  events: {
    // Entity actions
    LoadBrands: emptyProps(),
    LoadBrandsSuccess: props<{ brands: BrandInterface[] }>(),
    LoadBrandsFailure: emptyProps(),
    AddBrand: props<{ brandName: string }>(),
    AddBrandSuccess: props<{ brand: BrandInterface }>(),
    AddBrandFailure: emptyProps(),
    UpdateBrand: props<{ id: string; brandName: string }>(),
    UpdateBrandSuccess: props<{ brand: BrandInterface }>(),
    UpdateBrandFailure: emptyProps(),
    DeleteBrand: props<{ id: string }>(),
    DeleteBrandSuccess: props<{ id: string }>(),
    DeleteBrandFailure: emptyProps(),
    // Other actions
    SetCurrentBrandId: props<{ currentId: string }>(),
    ClearCurrentBrandId: emptyProps(),
  },
});
