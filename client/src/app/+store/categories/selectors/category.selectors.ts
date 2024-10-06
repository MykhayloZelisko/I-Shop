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
import { TreeNode } from 'primeng/api';
import { TreeNodeDataType } from '../../../shared/models/types/tree-node-data.type';
import { Dictionary } from '@ngrx/entity';
import { CascadeCategoryInterface } from '../../../shared/models/interfaces/cascade-category.interface';
// import { CPropertyInterface } from '../../../shared/models/interfaces/c-property.interface';
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

export const selectCategoriesWithPropertiesTree = createSelector(
  selectAllCategories,
  (categories: CategoryInterface[]) => {
    const emptyChild: TreeNode<TreeNodeDataType> = {
      type: 'default',
    };

    const categoriesWithGroups = categories.filter(
      (category) => category.groups.length > 0,
    );
    const categoriesWithoutGroups = categories.filter(
      (category) => category.groups.length === 0,
    );

    const categoriesWithChildren: TreeNode<CategoryInterface>[] =
      categoriesWithoutGroups.map((category) => ({
        data: category,
        type: 'category',
        children: [],
        expanded: category.expanded ?? false,
      }));

    for (const child of categoriesWithChildren) {
      if (child.data!.parentId) {
        const parentCategory = categoriesWithChildren.find(
          (parent) => parent.data!.id === child.data!.parentId,
        );
        if (parentCategory) {
          parentCategory.children!.push(child);
        }
      }
    }

    const allNodes: TreeNode<TreeNodeDataType>[] = categoriesWithChildren;

    for (const category of categoriesWithGroups) {
      const categoryNode: TreeNode<TreeNodeDataType> = {
        data: category,
        type: 'category',
        children: [],
        expanded: category.expanded ?? false,
      };

      categoryNode.children = category.groups.map((group) => {
        const groupNode: TreeNode<TreeNodeDataType> = {
          data: group,
          type: 'group',
          expanded: false,
          children: group.properties.map((property) => ({
            data: property,
            type: 'property',
            expanded: false,
          })),
        };
        return groupNode;
      });

      if (category.parentId === null) {
        allNodes.push(categoryNode);
      } else {
        const parentCategory = allNodes.find(
          (parent) => 'data' in parent && parent.data!.id === category.parentId,
        );
        if (parentCategory) {
          parentCategory.children!.push(categoryNode);
        }
      }
    }

    const result = allNodes.filter(
      (node) =>
        'data' in node &&
        'parentId' in node.data! &&
        node.data.parentId === null,
    );

    result.push(emptyChild);

    return result;
  },
);

export const selectCurrentCategory = createSelector(
  selectCategoryState,
  (state: State) => state.currentCategory,
);

export const selectCurrentGroup = createSelector(
  selectCategoryState,
  (state: State) => state.currentGroup,
);

export const selectNewCategory = createSelector(
  selectCategoryState,
  (state: State) => state.isNewCategory,
);

export const selectCurrentPropertyId = createSelector(
  selectCategoryState,
  (state: State) => state.currentPropertyId,
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

export const selectHasGroups = (
  id: string,
): MemoizedSelector<NonNullable<unknown>, boolean> =>
  createSelector(
    selectEntitiesCategories,
    (entities: Dictionary<CategoryInterface>) => {
      const entity = entities[id];
      return !!entity && !!entity.groups.length;
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

// export const selectProperties = (
//   id: string,
// ): MemoizedSelector<NonNullable<unknown>, CPropertyInterface[]> =>
//   createSelector(
//     selectEntitiesCategories,
//     (entities: Dictionary<CategoryInterface>) => {
//       const entity = entities[id];
//       return entity ? entity.properties : [];
//     },
//   );
//
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
