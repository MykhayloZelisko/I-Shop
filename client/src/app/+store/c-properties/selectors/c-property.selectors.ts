import {
  createFeature,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import {
  adapter,
  cPropertiesFeatureKey,
  reducer,
  State,
} from '../reducers/c-property.reducer';

const selectCPropertyState = createFeatureSelector<State>(
  cPropertiesFeatureKey,
);

export const cPropertiesFeature = createFeature({
  name: cPropertiesFeatureKey,
  reducer,
  extraSelectors: ({ selectCPropertiesState }) => ({
    ...adapter.getSelectors(selectCPropertiesState),
  }),
});

export const selectAllCProperties = cPropertiesFeature.selectAll;

export const selectEntitiesCProperties = cPropertiesFeature.selectEntities;

export const selectIdsCProperties = cPropertiesFeature.selectIds;

export const selectTotalCProperties = cPropertiesFeature.selectTotal;

export const selectCurrentPropertyId = createSelector(
  selectCPropertyState,
  (state: State) => state.currentPropertyId,
);
