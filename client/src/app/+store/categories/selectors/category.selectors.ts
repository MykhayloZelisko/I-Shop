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
import { CPropertyInterface } from '../../../shared/models/interfaces/c-property.interface';

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
    const categoriesWithChildren: TreeNode<CategoryInterface>[] =
      categories.map((category) => ({
        label: category.categoryName,
        key: category.id,
        data: category,
        type: 'category',
        children: [],
        expanded: category.expanded ?? false,
      }));

    for (const child of categoriesWithChildren) {
      if (child.data!.parentId) {
        const category = categoriesWithChildren.find(
          (parent) => parent.data!.id === child.data!.parentId,
        );
        category!.children!.push(child);
      }
    }

    return categoriesWithChildren.filter(
      (category) => category.data!.parentId === null,
    );
  },
);

export const selectCategoriesWithPropertiesTree = createSelector(
  selectAllCategories,
  (categories: CategoryInterface[]) => {
    const emptyChild: TreeNode<TreeNodeDataType> = {
      type: 'default',
    };

    const categoriesWithProperties = categories.filter(
      (category) => category.properties.length > 0,
    );
    const categoriesWithoutProperties = categories.filter(
      (category) => category.properties.length === 0,
    );

    const categoriesWithChildren: TreeNode<CategoryInterface>[] =
      categoriesWithoutProperties.map((category) => ({
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

    for (const category of categoriesWithProperties) {
      const categoryNode: TreeNode<TreeNodeDataType> = {
        data: category,
        type: 'category',
        children: [],
        expanded: category.expanded ?? false,
      };

      categoryNode.children = category.properties.map((property) => ({
        data: property,
        type: 'property',
        expanded: false,
      }));

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

export const selectNewCategory = createSelector(
  selectCategoryState,
  (state: State) => state.isNewCategory,
);

export const selectCurrentPropertyId = createSelector(
  selectCategoryState,
  (state: State) => state.currentPropertyId,
);

export const selectHasChildren = (
  id: string,
): MemoizedSelector<NonNullable<unknown>, boolean> =>
  createSelector(selectAllCategories, (categories: CategoryInterface[]) =>
    categories.some((category: CategoryInterface) => category.parentId === id),
  );

export const selectHasProperties = (
  id: string,
): MemoizedSelector<NonNullable<unknown>, boolean> =>
  createSelector(
    selectEntitiesCategories,
    (entities: Dictionary<CategoryInterface>) => {
      const entity = entities[id];
      return !!entity && !!entity.properties.length;
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

export const selectProperties = (
  id: string,
): MemoizedSelector<NonNullable<unknown>, CPropertyInterface[]> =>
  createSelector(
    selectEntitiesCategories,
    (entities: Dictionary<CategoryInterface>) => {
      const entity = entities[id];
      return entity ? entity.properties : [];
    },
  );
