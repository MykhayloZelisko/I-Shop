import {
  createFeature,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import {
  adapter,
  cPropertiesGroupsFeatureKey,
  reducer,
  State,
} from '../reducers/c-properties-group.reducer';

const selectCPropertiesGroupState = createFeatureSelector<State>(
  cPropertiesGroupsFeatureKey,
);

export const cPropertiesGroupsFeature = createFeature({
  name: cPropertiesGroupsFeatureKey,
  reducer,
  extraSelectors: ({ selectCPropertiesGroupsState }) => ({
    ...adapter.getSelectors(selectCPropertiesGroupsState),
  }),
});

export const selectAllCPropertiesGroups = cPropertiesGroupsFeature.selectAll;

export const selectEntitiesCPropertiesGroups =
  cPropertiesGroupsFeature.selectEntities;

export const selectIdsCPropertiesGroups = cPropertiesGroupsFeature.selectIds;

export const selectTotalCPropertiesGroups =
  cPropertiesGroupsFeature.selectTotal;

export const selectCurrentGroup = createSelector(
  selectCPropertiesGroupState,
  (state: State) => state.currentGroup,
);
