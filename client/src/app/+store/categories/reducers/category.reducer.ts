import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CategoryActions } from '../actions/category.actions';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import { UpdateStr } from '@ngrx/entity/src/models';
import { CurrentStatusInterface } from '../../../shared/models/interfaces/current-status.interface';

export const categoriesFeatureKey = 'categories';

export interface State extends EntityState<CategoryInterface> {
  currentCategory: CurrentStatusInterface;
  currentGroup: CurrentStatusInterface;
  isNewCategory: boolean;
  currentPropertyId: string | null;
}

export const adapter: EntityAdapter<CategoryInterface> =
  createEntityAdapter<CategoryInterface>();

export const initialState: State = adapter.getInitialState({
  currentCategory: {
    id: null,
    isEditable: false,
  },
  currentGroup: {
    id: null,
    isEditable: false,
  },
  isNewCategory: false,
  currentPropertyId: null,
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
        icon: action.category.icon,
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
    CategoryActions.addCPropertiesGroupsSuccess,
    CategoryActions.updateCPropertiesGroupSuccess,
    CategoryActions.deleteCPropertiesGroupSuccess,
    CategoryActions.addCPropertiesSuccess,
    CategoryActions.updateCPropertySuccess,
    CategoryActions.deleteCPropertySuccess,
    (state, action) => {
      const update: UpdateStr<CategoryInterface> = {
        id: action.category.id,
        changes: {
          groups: action.category.groups,
        },
      };
      return adapter.updateOne(update, state);
    },
  ),
  // other actions
  on(CategoryActions.updateCGPState, (state, action) => ({
    ...state,
    currentPropertyId: action.payload.currentPropertyId,
    isNewCategory: action.payload.isNewCategory,
    currentCategory: { ...action.payload.currentCategory },
    currentGroup: { ...action.payload.currentGroup },
  })),
  on(CategoryActions.clearCGPState, (state) => ({
    ...state,
    currentPropertyId: null,
    isNewCategory: false,
    currentCategory: { id: null, isEditable: false },
    currentGroup: { id: null, isEditable: false },
  })),
);
