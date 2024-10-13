import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CPropertyActions } from '../actions/c-property.actions';
import { CPropertyInterface } from '../../../shared/models/interfaces/c-property.interface';
import { SharedActions } from '../../shared/actions/shared.actions';
import { UpdateStr } from '@ngrx/entity/src/models';

export const cPropertiesFeatureKey = 'cProperties';

export interface State extends EntityState<CPropertyInterface> {
  currentPropertyId: string | null;
}

export const adapter: EntityAdapter<CPropertyInterface> =
  createEntityAdapter<CPropertyInterface>();

export const initialState: State = adapter.getInitialState({
  currentPropertyId: null,
});

export const reducer = createReducer(
  initialState,
  // entity actions
  on(
    CPropertyActions.addCPropertiesSuccess,
    CPropertyActions.addCPropertiesByGroupIdSuccess,
    (state, action) => adapter.addMany(action.properties, state),
  ),
  on(CPropertyActions.updateCPropertySuccess, (state, action) => {
    const update: UpdateStr<CPropertyInterface> = {
      id: action.property.id,
      changes: {
        propertyName: action.property.propertyName,
      },
    };
    return adapter.updateOne(update, state);
  }),
  on(CPropertyActions.deleteCPropertySuccess, (state, action) =>
    adapter.removeOne(action.id, state),
  ),
  on(CPropertyActions.deleteCProperties, (state, action) =>
    adapter.removeMany(action.ids, state),
  ),
  // other actions
  on(SharedActions.updateCGPState, (state, action) => ({
    ...state,
    currentPropertyId: action.payload.currentPropertyId,
  })),
  on(SharedActions.clearCGPState, (state) => ({
    ...state,
    currentPropertyId: null,
  })),
);
