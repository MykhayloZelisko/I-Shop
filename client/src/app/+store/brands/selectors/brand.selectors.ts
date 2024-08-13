import {
  createFeature,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import {
  adapter,
  brandsFeatureKey,
  reducer,
  State,
} from '../reducers/brand.reducer';

const selectBrandState = createFeatureSelector<State>(brandsFeatureKey);

export const brandsFeature = createFeature({
  name: brandsFeatureKey,
  reducer,
  extraSelectors: ({ selectBrandsState }) => ({
    ...adapter.getSelectors(selectBrandsState),
  }),
});

export const selectAllBrands = brandsFeature.selectAll;

export const selectEntitiesBrands = brandsFeature.selectEntities;

export const selectIdsBrands = brandsFeature.selectIds;

export const selectTotalBrands = brandsFeature.selectTotal;

export const selectCurrentBrandId = createSelector(
  selectBrandState,
  (state: State) => state.currentId,
);
