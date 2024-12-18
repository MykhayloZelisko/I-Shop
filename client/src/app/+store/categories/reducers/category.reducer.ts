import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CategoryActions } from '../actions/category.actions';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import { UpdateStr } from '@ngrx/entity/src/models';
import { CurrentStatusInterface } from '../../../shared/models/interfaces/current-status.interface';
import { SharedActions } from '../../shared/actions/shared.actions';

export const categoriesFeatureKey = 'categories';

export interface State extends EntityState<CategoryInterface> {
  currentCategory: CurrentStatusInterface;
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
        icon: action.category.icon,
        expanded: action.category.expanded,
        hasGroups: action.category.hasGroups,
      },
    };
    return adapter.updateOne(update, state);
  }),
  on(CategoryActions.updateCategories, (state, action) => {
    const categoryIds: string[] = state.ids as string[];
    const updatedCategories: UpdateStr<CategoryInterface>[] = categoryIds.map(
      (id: string) => {
        const category = state.entities[id];
        const changes: Partial<CategoryInterface> = {};

        if (action.expanded !== undefined) {
          changes.expanded = action.expanded;
        }
        if (action.loadedGroups !== undefined && category?.hasGroups) {
          changes.loadedGroups = action.loadedGroups;
        }

        return { id, changes };
      },
    );
    return adapter.updateMany(updatedCategories, state);
  }),
  on(CategoryActions.deleteCategorySuccess, (state, action) =>
    adapter.removeMany(action.ids, state),
  ),
  on(CategoryActions.loadCategoriesSuccess, (state, action) =>
    adapter.setAll(action.categories, state),
  ),
  // other actions
  on(SharedActions.updateCGPState, (state, action) => ({
    ...state,
    isNewCategory: action.payload.isNewCategory,
    currentCategory: { ...action.payload.currentCategory },
  })),
  on(SharedActions.clearCGPState, (state) => ({
    ...state,
    isNewCategory: false,
    currentCategory: { id: null, isEditable: false },
  })),
);
