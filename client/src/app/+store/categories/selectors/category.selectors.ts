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
// import { TreeNode } from 'primeng/api';
// import { TreeNodeDataType } from '../../../shared/models/types/tree-node-data.type';
// import { Dictionary } from '@ngrx/entity';
import { CascadeCategoryInterface } from '../../../shared/models/interfaces/cascade-category.interface';
// import { CPropertiesGroupInterface } from '../../../shared/models/interfaces/c-properties-group.interface';
import {
  selectIdAndPage,
  // selectRouter,
} from '../../router/selectors/router.selectors';
// import { selectDevice } from '../../devices/selectors/device.selectors';

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
    (categories: CategoryInterface[], params) => {
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
        category!.children.push(child);
      }
    }

    return categoriesWithChildren.filter(
      (category) => category.parentId === null,
    );
  },
);

// export const selectHasChildChain = createSelector(
//   selectAllCategories,
//   selectIdAndPage,
//   (categories: CategoryInterface[], params) => {
//     const childCategories = categories.filter(
//       (category: CategoryInterface) => category.parentId === params.id,
//     );
//
//     return childCategories.some((childCategory: CategoryInterface) =>
//       categories.some(
//         (category: CategoryInterface) => category.parentId === childCategory.id,
//       ),
//     );
//   },
// );
//
// export const selectCascadeSubCategories = createSelector(
//   selectCascadeCategories,
//   selectIdAndPage,
//   (categories: CascadeCategoryInterface[], params) => {
//     const findSubtree = (
//       categoryId: string | null,
//       nodes: CascadeCategoryInterface[],
//     ): CascadeCategoryInterface | null => {
//       for (const node of nodes) {
//         if (node.id === categoryId) {
//           return node;
//         }
//
//         if (node.children && node.children.length > 0) {
//           const childSubtree = findSubtree(categoryId, node.children);
//           if (childSubtree) {
//             return childSubtree;
//           }
//         }
//       }
//       return null;
//     };
//
//     return findSubtree(params.id, categories);
//   },
// );
//
// export const selectBreadcrumbsParams = createSelector(
//   selectRouter,
//   selectEntitiesCategories,
//   selectDevice,
//   (params, categories, device) => {
//     const isCategory = params.state.url.startsWith('/categories');
//     if (isCategory) {
//       let categoryPath: CategoryInterface[] = [];
//       let currentCategory = categories[params.state.params['id']];
//
//       while (currentCategory) {
//         categoryPath = [currentCategory, ...categoryPath];
//         currentCategory = currentCategory.parentId
//           ? categories[currentCategory.parentId]
//           : undefined;
//       }
//
//       return { isCategory, categoryPath };
//     } else if (device) {
//       let categoryPath: CategoryInterface[] = [];
//       let currentCategory = categories[device.category.id];
//
//       while (currentCategory) {
//         categoryPath = [currentCategory, ...categoryPath];
//         currentCategory = currentCategory.parentId
//           ? categories[currentCategory.parentId]
//           : undefined;
//       }
//
//       return { isCategory, categoryPath };
//     } else {
//       return null;
//     }
//   },
// );
