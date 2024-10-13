import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CPropertiesGroupActions } from '../actions/c-properties-group.actions';
import { CurrentStatusInterface } from '../../../shared/models/interfaces/current-status.interface';
import { CPropertiesGroupInterface } from '../../../shared/models/interfaces/c-properties-group.interface';
import { SharedActions } from '../../shared/actions/shared.actions';
import { UpdateStr } from '@ngrx/entity/src/models';

export const cPropertiesGroupsFeatureKey = 'cPropertiesGroups';

export interface State extends EntityState<CPropertiesGroupInterface> {
  currentGroup: CurrentStatusInterface;
}

export const adapter: EntityAdapter<CPropertiesGroupInterface> =
  createEntityAdapter<CPropertiesGroupInterface>();

export const initialState: State = adapter.getInitialState({
  currentGroup: {
    id: null,
    isEditable: false,
  },
});

export const reducer = createReducer(
  initialState,
  // entity actions
  on(
    CPropertiesGroupActions.addCPropertiesGroupsSuccess,
    CPropertiesGroupActions.addFilteredGroupsSuccess,
    CPropertiesGroupActions.addCPGroupsByCategoryIdSuccess,
    (state, action) => adapter.addMany(action.groups, state),
  ),
  on(CPropertiesGroupActions.updateCPropertiesGroupSuccess, (state, action) => {
    const update: UpdateStr<CPropertiesGroupInterface> = {
      id: action.group.id,
      changes: {
        groupName: action.group.groupName,
        expanded: action.group.expanded,
        hasProperties: action.group.hasProperties,
      },
    };
    return adapter.updateOne(update, state);
  }),
  on(CPropertiesGroupActions.updateCPropertiesGroups, (state, action) => {
    const groupIds: string[] = state.ids as string[];
    const updatedGroups: UpdateStr<CPropertiesGroupInterface>[] = groupIds.map(
      (id: string) => {
        const changes: Partial<CPropertiesGroupInterface> = {};

        if (action.expanded !== undefined) {
          changes.expanded = action.expanded;
        }
        if (action.loadedProperties !== undefined) {
          changes.loadedProperties = action.loadedProperties;
        }

        return { id, changes };
      },
    );
    return adapter.updateMany(updatedGroups, state);
  }),
  on(CPropertiesGroupActions.deleteCPropertiesGroupSuccess, (state, action) =>
    adapter.removeOne(action.id, state),
  ),
  on(CPropertiesGroupActions.deleteCPropertiesGroups, (state, action) =>
    adapter.removeMany(action.ids, state),
  ),
  // other actions
  on(SharedActions.updateCGPState, (state, action) => ({
    ...state,
    currentGroup: { ...action.payload.currentGroup },
  })),
  on(SharedActions.clearCGPState, (state) => ({
    ...state,
    currentGroup: { id: null, isEditable: false },
  })),
);
