import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CategoryActions } from '../actions/category.actions';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import { UpdateStr } from '@ngrx/entity/src/models';
import { CurrentCategoryStatusInterface } from '../../../shared/models/interfaces/current-category-status.interface';

export const categoriesFeatureKey = 'categories';

export interface State extends EntityState<CategoryInterface> {
  currentCategory: CurrentCategoryStatusInterface;
  isNewCategory: boolean;
}

export const adapter: EntityAdapter<CategoryInterface> =
  createEntityAdapter<CategoryInterface>();

export const initialState: State = adapter.getInitialState({
  currentCategory: {
    id: null,
    isEditable: false,
  },
  isNewCategory: false,
});

export const reducer = createReducer(
  initialState,
  // entity actions
  on(CategoryActions.addCategorySuccess, (state, action) =>
    adapter.addOne(action.category, state),
  ),
  on(CategoryActions.addCategoriesSuccess, (state, action) =>
    adapter.addMany(action.categories, state),
  ),
  on(CategoryActions.updateCategorySuccess, (state, action) => {
    const update: UpdateStr<CategoryInterface> = {
      id: action.category.id,
      changes: {
        categoryName: action.category.categoryName,
        image: action.category.image,
        expanded: action.category.expanded,
      },
    };
    return adapter.updateOne(update, state);
  }),
  on(CategoryActions.updateCategories, (state, action) => {
    const categoryIds: string[] = state.ids as string[];
    const updatedCategories: UpdateStr<CategoryInterface>[] = categoryIds.map(
      (id: string) => ({
        id,
        changes: { expanded: action.expanded },
      }),
    );
    return adapter.updateMany(updatedCategories, state);
  }),
  on(CategoryActions.deleteCategories, (state, action) =>
    adapter.removeMany(action.ids, state),
  ),
  on(CategoryActions.loadCategoriesSuccess, (state, action) =>
    adapter.setAll(action.categories, state),
  ),
  on(
    CategoryActions.addCPropertiesSuccess,
    CategoryActions.updateCPropertySuccess,
    CategoryActions.deleteCPropertySuccess,
    (state, action) => {
      const update: UpdateStr<CategoryInterface> = {
        id: action.category.id,
        changes: {
          properties: action.category.properties,
        },
      };
      return adapter.updateOne(update, state);
    },
  ),
  // other actions
  on(CategoryActions.openNewCategory, (state) => ({
    ...state,
    isNewCategory: true,
  })),
  on(CategoryActions.closeNewCategory, (state) => ({
    ...state,
    isNewCategory: false,
  })),
  on(CategoryActions.changeCurrentCategoryStatus, (state, action) => ({
    ...state,
    currentCategory: action.categoryStatus,
  })),
);
