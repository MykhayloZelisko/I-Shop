import { createSelector, MemoizedSelector } from '@ngrx/store';
import {
  selectAllCategories,
  selectEntitiesCategories,
} from '../../categories/selectors/category.selectors';
import { selectAllCPropertiesGroups } from '../../c-properties-groups/selectors/c-properties-group.selectors';
import { selectAllCProperties } from '../../c-properties/selectors/c-property.selectors';
import { CPropertiesGroupInterface } from '../../../shared/models/interfaces/c-properties-group.interface';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import { CPropertyInterface } from '../../../shared/models/interfaces/c-property.interface';
import { TreeNode } from 'primeng/api';
import { TreeNodeDataType } from '../../../shared/models/types/tree-node-data.type';
import { GPTreeInterface } from '../../../shared/models/interfaces/g-p-tree.interface';
import { GPLoadInterface } from '../../../shared/models/interfaces/g-p-load.interface';

export const selectCGPTree = createSelector(
  selectAllCategories,
  selectAllCPropertiesGroups,
  selectAllCProperties,
  (
    categories: CategoryInterface[],
    groups: CPropertiesGroupInterface[],
    properties: CPropertyInterface[],
  ) => {
    const emptyChild: TreeNode<TreeNodeDataType> = {
      type: 'default',
    };

    const categoryMap: Record<string, TreeNode<TreeNodeDataType>> = {};
    categories.forEach((category) => {
      categoryMap[category.id] = {
        data: category,
        type: 'category',
        children: [],
        leaf: !category.hasGroups,
        expanded: category.expanded ?? false,
      };
    });

    const groupMap: Record<string, TreeNode<TreeNodeDataType>> = {};
    groups.forEach((group) => {
      groupMap[group.id] = {
        data: group,
        type: 'group',
        children: properties
          .filter((property) => property.groupId === group.id)
          .map((property) => ({
            data: property,
            type: 'property',
          })),
        leaf: !group.hasProperties,
        expanded: group.expanded ?? false,
      };
    });
    groups.forEach((group) => {
      const category = categoryMap[group.categoryId];
      if (category) {
        category.children!.push(groupMap[group.id]);
      }
    });

    categories.forEach((category) => {
      if (category.parentId) {
        const parentCategory = categoryMap[category.parentId];
        if (parentCategory) {
          parentCategory.children!.push(categoryMap[category.id]);
        }
      }
    });

    categories.forEach((category) => {
      const node = categoryMap[category.id];
      node.leaf =
        !(node.children && node.children.length > 0) && !category.hasGroups;
    });

    const rootNodes = Object.values(categoryMap).filter((node) => {
      if (node.data && 'parentId' in node.data) {
        return !node.data.parentId;
      }
      return false;
    });

    rootNodes.push(emptyChild);
    return rootNodes;
  },
);

export const selectGPTreeById = (
  categoryId: string,
): MemoizedSelector<NonNullable<unknown>, GPTreeInterface[]> =>
  createSelector(
    selectEntitiesCategories,
    selectAllCPropertiesGroups,
    selectAllCProperties,
    (categoryEntities, groups, properties) => {
      const category = categoryEntities[categoryId];
      if (!category || !category.hasGroups) {
        return [];
      }
      const categoryGroups = groups.filter(
        (group) => group && group.categoryId === categoryId,
      );
      return categoryGroups.map((group) => ({
        ...group,
        properties: properties.filter(
          (property) => property && group && property.groupId === group.id,
        ),
      }));
    },
  );

export const selectLoadGroupsAndPropertiesForCategory = (
  categoryId: string,
): MemoizedSelector<NonNullable<unknown>, GPLoadInterface> =>
  createSelector(
    selectEntitiesCategories,
    selectAllCPropertiesGroups,
    selectAllCProperties,
    (categoriesEntities, groups, properties) => {
      const category = categoriesEntities[categoryId];
      const filteredGroups = groups.filter(
        (group) => group.categoryId === categoryId && group.hasProperties,
      );
      const loadGroups =
        filteredGroups.length === 0 && !!category && category.hasGroups;
      const groupsIds = loadGroups
        ? []
        : filteredGroups
            .map((group) => group.id)
            .filter(
              (groupId) => !properties.some((prop) => prop.groupId === groupId),
            );
      const loadProperties = {
        allGroups: loadGroups,
        groupsIds,
      };

      return { loadGroups, loadProperties };
    },
  );