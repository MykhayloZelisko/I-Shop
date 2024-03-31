import { createFeature, createSelector } from '@ngrx/store';
import {
  adapter,
  categoriesFeatureKey,
  reducer,
} from '../reducers/category.reducer';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import { CategoriesTreeInterface } from '../../../shared/models/interfaces/categories-tree.interface';

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
    const categoriesWithChildren: CategoriesTreeInterface[] = categories.map(
      (category) => ({
        ...category,
        children: [],
      }),
    );
    const maxLevel = Math.max(
      ...categoriesWithChildren.map((category) => category.level),
    );
    for (let level = maxLevel; level > 0; level--) {
      const currentLevelCategories = categoriesWithChildren.filter(
        (category) => category.level === level,
      );
      currentLevelCategories.forEach((category) => {
        const parentCategory = categoriesWithChildren.find(
          (c) => c.id === category.parentId,
        );
        if (parentCategory) {
          parentCategory.children.push(category);
        }
      });
    }

    return categoriesWithChildren.filter((category) => category.level === 1);
  },
);
