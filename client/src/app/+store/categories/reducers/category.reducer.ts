import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CategoryActions } from '../actions/category.actions';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import { UpdateStr } from '@ngrx/entity/src/models';

export const categoriesFeatureKey = 'categories';

export interface State extends EntityState<CategoryInterface> {
  currentCategoryId: string | null;
  isNewCategory: boolean;
}

export const adapter: EntityAdapter<CategoryInterface> =
  createEntityAdapter<CategoryInterface>();

export const initialState: State = adapter.getInitialState({
  currentCategoryId: null,
  isNewCategory: false,
});

export const reducer = createReducer(
  initialState,
  on(CategoryActions.addCategorySuccess, (state, action) =>
    adapter.addOne(action.category, state),
  ),
  // on(CategoryActions.upsertCategory, (state, action) =>
  //   adapter.upsertOne(action.category, state),
  // ),
  // on(CategoryActions.addCategorys, (state, action) =>
  //   adapter.addMany(action.categorys, state),
  // ),
  // on(CategoryActions.upsertCategorys, (state, action) =>
  //   adapter.upsertMany(action.categorys, state),
  // ),
  on(CategoryActions.updateCategorySuccess, (state, action) => {
    const update: UpdateStr<CategoryInterface> = {
      id: action.category.id,
      changes: {
        categoryName: action.category.categoryName,
      },
    };
    return adapter.updateOne(update, state);
  }),
  // on(CategoryActions.updateCategorys, (state, action) =>
  //   adapter.updateMany(action.categorys, state),
  // ),
  // on(CategoryActions.deleteCategory, (state, action) =>
  //   adapter.removeOne(action.id, state),
  // ),
  on(CategoryActions.deleteCategories, (state, action) =>
    adapter.removeMany(action.ids, state),
  ),
  on(CategoryActions.loadCategoriesSuccess, (state, action) =>
    adapter.setAll(action.categories, state),
  ),
  // on(CategoryActions.clearCategorys, (state) => adapter.removeAll(state)),
  on(CategoryActions.openNewCategory, (state) => ({
    ...state,
    isNewCategory: true,
  })),
  on(CategoryActions.closeNewCategory, (state) => ({
    ...state,
    isNewCategory: false,
  })),
  on(CategoryActions.setCurrentCategoryId, (state, action) => ({
    ...state,
    currentCategoryId: action.categoryId,
  })),
  on(CategoryActions.clearCurrentCategoryId, (state) => ({
    ...state,
    currentCategoryId: null,
  })),
);
