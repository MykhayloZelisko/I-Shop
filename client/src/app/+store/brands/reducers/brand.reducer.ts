import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { BrandActions } from '../actions/brand.actions';
import { BrandInterface } from '../../../shared/models/interfaces/brand.interface';
import { UpdateStr } from '@ngrx/entity/src/models';

export const brandsFeatureKey = 'brands';

export interface State extends EntityState<BrandInterface> {
  currentId: string | null;
}

export const adapter: EntityAdapter<BrandInterface> =
  createEntityAdapter<BrandInterface>({
    sortComparer: (a: BrandInterface, b: BrandInterface): number =>
      a.brandName.localeCompare(b.brandName),
  });

export const initialState: State = adapter.getInitialState({
  currentId: null,
});

export const reducer = createReducer(
  initialState,
  // Entity actions
  on(BrandActions.addBrandSuccess, (state, action) =>
    adapter.addOne(action.brand, state),
  ),
  on(BrandActions.updateBrandSuccess, (state, action) => {
    const update: UpdateStr<BrandInterface> = {
      id: action.brand.id,
      changes: {
        brandName: action.brand.brandName,
      },
    };
    return adapter.updateOne(update, state);
  }),
  on(BrandActions.deleteBrandSuccess, (state, action) =>
    adapter.removeOne(action.id, state),
  ),
  on(BrandActions.loadBrandsSuccess, (state, action) =>
    adapter.setAll(action.brands, state),
  ),
  // Other actions
  on(BrandActions.setCurrentBrandId, (state, action) => ({
    ...state,
    currentId: action.currentId,
  })),
  on(BrandActions.clearCurrentBrandId, (state) => ({
    ...state,
    currentId: null,
  })),
);
