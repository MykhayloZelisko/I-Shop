import { createFeature, createFeatureSelector, createSelector } from '@ngrx/store';
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
    const maxLevel = Math.max(
      ...categoriesWithChildren.map((category) => category.data!.level),
    );
    for (let level = maxLevel; level > 0; level--) {
      const currentLevelCategories = categoriesWithChildren.filter(
        (category) => category.data!.level === level,
      );
      currentLevelCategories.forEach((category) => {
        const parentCategory = categoriesWithChildren.find(
          (c) => c.data!.id === category.data!.parentId,
        );
        if (parentCategory) {
          parentCategory.children!.push(category);
        }
      });
    }

    const result = categoriesWithChildren.filter(
      (category) => category.data!.level === 1,
    );
    result.push(emptyChild);

    return result;
  },
);

export const selectCurrentCategoryId = createSelector(
  selectCategoryState,
  (state: State) => state.currentCategoryId,
);

export const selectNewCategory = createSelector(
  selectCategoryState,
  (state: State) => state.isNewCategory,
);
