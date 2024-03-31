import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CategoryActions } from '../actions/category.actions';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';

export const categoriesFeatureKey = 'categories';

export type State = EntityState<CategoryInterface>;

export const adapter: EntityAdapter<CategoryInterface> =
  createEntityAdapter<CategoryInterface>();

export const initialState: State = adapter.getInitialState({});

export const reducer = createReducer(
  initialState,
  // on(CategoryActions.addCategory, (state, action) =>
  //   adapter.addOne(action.category, state),
  // ),
  // on(CategoryActions.upsertCategory, (state, action) =>
  //   adapter.upsertOne(action.category, state),
  // ),
  // on(CategoryActions.addCategorys, (state, action) =>
  //   adapter.addMany(action.categorys, state),
  // ),
  // on(CategoryActions.upsertCategorys, (state, action) =>
  //   adapter.upsertMany(action.categorys, state),
  // ),
  // on(CategoryActions.updateCategory, (state, action) =>
  //   adapter.updateOne(action.category, state),
  // ),
  // on(CategoryActions.updateCategorys, (state, action) =>
  //   adapter.updateMany(action.categorys, state),
  // ),
  // on(CategoryActions.deleteCategory, (state, action) =>
  //   adapter.removeOne(action.id, state),
  // ),
  // on(CategoryActions.deleteCategorys, (state, action) =>
  //   adapter.removeMany(action.ids, state),
  // ),
  on(CategoryActions.loadCategoriesSuccess, (state, action) =>
    adapter.setAll(action.categories, state),
  ),
  // on(CategoryActions.clearCategorys, (state) => adapter.removeAll(state)),
);
