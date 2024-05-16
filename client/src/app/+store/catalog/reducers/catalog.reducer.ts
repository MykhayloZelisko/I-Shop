import { createReducer, on } from '@ngrx/store';
import { CatalogActions } from '../actions/catalog.actions';
import { CatalogSizeEnum } from '../../../shared/models/enums/catalog-size.enum';

export const catalogFeatureKey = 'catalog';

export interface State {
  size: CatalogSizeEnum;
}

export const initialState: State = {
  size: CatalogSizeEnum.None,
};

export const reducer = createReducer(
  initialState,
  on(CatalogActions.openCatalog, (state, action) => ({
    ...state,
    ...action.catalog,
  })),
);
