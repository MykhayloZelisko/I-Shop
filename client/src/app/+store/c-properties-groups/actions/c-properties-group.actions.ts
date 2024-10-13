import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CreateCPropertiesGroupInterface } from '../../../shared/models/interfaces/create-c-properties-group.interface';
import { CPropertiesGroupInterface } from '../../../shared/models/interfaces/c-properties-group.interface';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';

export const CPropertiesGroupActions = createActionGroup({
  source: 'CPropertiesGroup/API',
  events: {
    AddCPGroupsByCategoryId: props<{ category: CategoryInterface }>(),
    AddCPGroupsByCategoryIdSuccess: props<{
      category: CategoryInterface;
      groups: CPropertiesGroupInterface[];
    }>(),
    AddCPGroupsByCategoryIdFailure: emptyProps(),
    AddCPropertiesGroups: props<{
      category: CategoryInterface;
      groups: CreateCPropertiesGroupInterface[];
    }>(),
    AddCPropertiesGroupsSuccess: props<{
      groups: CPropertiesGroupInterface[];
    }>(),
    AddCPropertiesGroupsFailure: emptyProps(),
    AddFilteredGroups: props<{ ids: string[] }>(),
    AddFilteredGroupsSuccess: props<{
      groups: CPropertiesGroupInterface[];
    }>(),
    AddFilteredGroupsFailure: emptyProps(),
    UpdateCPropertiesGroup: props<{
      id: string;
      groupName: string;
    }>(),
    UpdateCPropertiesGroupSuccess: props<{
      group: CPropertiesGroupInterface;
    }>(),
    UpdateCPropertiesGroupFailure: emptyProps(),
    UpdateCPropertiesGroups: props<{
      expanded?: boolean;
      loadedProperties?: boolean;
    }>(),
    DeleteCPropertiesGroup: props<{ id: string }>(),
    DeleteCPropertiesGroupSuccess: props<{ id: string }>(),
    DeleteCPropertiesGroupFailure: emptyProps(),
    DeleteCPropertiesGroups: props<{ ids: string[] }>(),
  },
});
