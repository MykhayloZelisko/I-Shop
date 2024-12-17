import {
  createFeature,
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';
import {
  adapter,
  categoriesFeatureKey,
  reducer,
  State,
} from '../reducers/category.reducer';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import { CascadeCategoryInterface } from '../../../shared/models/interfaces/cascade-category.interface';
import { selectIdAndPage } from '../../router/selectors/router.selectors';
import { RouterParamsInterface } from '../../../shared/models/interfaces/router-params.interface';

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

export const selectCurrentCategory = createSelector(
  selectCategoryState,
  (state: State) => state.currentCategory,
);

export const selectNewCategory = createSelector(
  selectCategoryState,
  (state: State) => state.isNewCategory,
);

export const selectHasChildren = (
  categoryId?: string,
): MemoizedSelector<NonNullable<unknown>, boolean> =>
  createSelector(
    selectAllCategories,
    selectIdAndPage,
    (categories: CategoryInterface[], params: RouterParamsInterface) => {
      const newId = categoryId ?? params.id;
      return categories.some(
        (category: CategoryInterface) => category.parentId === newId,
      );
    },
  );

export const selectCascadeCategories = createSelector(
  selectAllCategories,
  (categories: CategoryInterface[]) => {
    const categoriesWithChildren: CascadeCategoryInterface[] = categories.map(
      (category) => ({
        ...category,
        children: [],
      }),
    );

    for (const child of categoriesWithChildren) {
      if (child.parentId) {
        const category = categoriesWithChildren.find(
          (parent) => parent.id === child.parentId,
        );
        if (category) {
          category.children.push(child);
        }
      }
    }

    return categoriesWithChildren.filter(
      (category) => category.parentId === null,
    );
  },
);

export const selectHasChildChain = createSelector(
  selectAllCategories,
  selectIdAndPage,
  (categories: CategoryInterface[], params: RouterParamsInterface) => {
    const childCategories = categories.filter(
      (category: CategoryInterface) => category.parentId === params.id,
    );

    return childCategories.some((childCategory: CategoryInterface) =>
      categories.some(
        (category: CategoryInterface) => category.parentId === childCategory.id,
      ),
    );
  },
);

export const selectCascadeSubCategories = createSelector(
  selectCascadeCategories,
  selectIdAndPage,
  (categories: CascadeCategoryInterface[], params: RouterParamsInterface) => {
    const findSubtree = (
      categoryId: string | null,
      nodes: CascadeCategoryInterface[],
    ): CascadeCategoryInterface | null => {
      for (const node of nodes) {
        if (node.id === categoryId) {
          return node;
        }

        if (node.children && node.children.length > 0) {
          const childSubtree = findSubtree(categoryId, node.children);
          if (childSubtree) {
            return childSubtree;
          }
        }
      }
      return null;
    };

    return findSubtree(params.id, categories);
  },
);
