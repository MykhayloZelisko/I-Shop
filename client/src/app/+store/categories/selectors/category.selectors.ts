import {
  createFeature,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import {
  adapter,
  categoriesFeatureKey,
  reducer,
  State,
} from '../reducers/category.reducer';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import { TreeNode } from 'primeng/api';

const selectCategoryState = createFeatureSelector<State>(categoriesFeatureKey);

export const categoriesFeature = createFeature({
  name: categoriesFeatureKey,
  reducer,
  extraSelectors: ({ selectCategoriesState }) => ({
    ...adapter.getSelectors(selectCategoriesState),
  }),
});

export const selectAllCategories = categoriesFeature.selectAll;

export const selectEntitiesCategories = categoriesFeature.selectEntities;

export const selectIdsCategories = categoriesFeature.selectIds;

export const selectTotalCategories = categoriesFeature.selectTotal;

export const selectCategoriesTree = createSelector(
  selectAllCategories,
  (categories: CategoryInterface[]) => {
    const emptyChild: TreeNode<CategoryInterface> = {
      type: 'default',
    };

    const categoriesWithChildren: TreeNode<CategoryInterface>[] =
      categories.map((category) => ({
        data: category,
        type: 'default',
        children: [],
      }));

    for (const item1 of categoriesWithChildren) {
      if (item1.data!.parentId) {
        const category = categoriesWithChildren.find(
          (item) => item.data!.id === item1.data!.parentId,
        );
        category!.children!.push(item1);
      }
    }

    const result = categoriesWithChildren.filter(
      (category) => category.data!.parentId === null,
    );
    result.push(emptyChild);

    return result;
  },
);

export const selectCurrentCategory = createSelector(
  selectCategoryState,
  (state: State) => state.currentCategory,
);

export const selectNewCategory = createSelector(
  selectCategoryState,
  (state: State) => state.isNewCategory,
);
