import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import { CreateCategoryInterface } from '../../../shared/models/interfaces/create-category.interface';
import { UpdateCategoryInterface } from '../../../shared/models/interfaces/update-category.interface';
import { CreateCPropertyInterface } from '../../../shared/models/interfaces/create-c-property.interface';
import { CGPStateInterface } from '../../../shared/models/interfaces/c-g-p-state.interface';
import { CreateCPropertiesGroupInterface } from '../../../shared/models/interfaces/create-c-properties-group.interface';

export const CategoryActions = createActionGroup({
  source: 'Category/API',
  events: {
    // Entity actions
    LoadCategories: emptyProps(),
    LoadCategoriesSuccess: props<{ categories: CategoryInterface[] }>(),
    LoadCategoriesFailure: emptyProps(),
    AddCategories: props<{ categories: CreateCategoryInterface[] }>(),
    AddCategoriesSuccess: props<{ categories: CategoryInterface[] }>(),
    AddCategoriesFailure: emptyProps(),
    AddCategory: props<{ category: CreateCategoryInterface }>(),
    AddCategorySuccess: props<{ category: CategoryInterface }>(),
    AddCategoryFailure: emptyProps(),
    UpdateCategory: props<{ id: string; category: UpdateCategoryInterface }>(),
    UpdateCategorySuccess: props<{ category: CategoryInterface }>(),
    UpdateCategoryFailure: emptyProps(),
    UpdateCategories: props<{ expanded: boolean }>(),
    DeleteCategory: props<{ id: string }>(),
    DeleteCategorySuccess: props<{ ids: string[] }>(),
    DeleteCategoryFailure: emptyProps(),
    DeleteCategories: props<{ ids: string[] }>(),
    AddCProperties: props<{ properties: CreateCPropertyInterface[] }>(),
    AddCPropertiesSuccess: props<{ category: CategoryInterface }>(),
    AddCPropertiesFailure: emptyProps(),
    DeleteCProperty: props<{ id: string }>(),
    DeleteCPropertySuccess: props<{ category: CategoryInterface }>(),
    DeleteCPropertyFailure: emptyProps(),
    UpdateCProperty: props<{ id: string; propertyName: string }>(),
    UpdateCPropertySuccess: props<{ category: CategoryInterface }>(),
    UpdateCPropertyFailure: emptyProps(),
    AddCPropertiesGroups: props<{
      groups: CreateCPropertiesGroupInterface[];
    }>(),
    AddCPropertiesGroupsSuccess: props<{ category: CategoryInterface }>(),
    AddCPropertiesGroupsFailure: emptyProps(),
    UpdateCPropertiesGroup: props<{ id: string; groupName: string }>(),
    UpdateCPropertiesGroupSuccess: props<{ category: CategoryInterface }>(),
    UpdateCPropertiesGroupFailure: emptyProps(),
    DeleteCPropertiesGroup: props<{ id: string }>(),
    DeleteCPropertiesGroupSuccess: props<{ category: CategoryInterface }>(),
    DeleteCPropertiesGroupFailure: emptyProps(),
    // Other actions
    UpdateCGPState: props<{ payload: CGPStateInterface }>(),
    ClearCGPState: emptyProps(),
  },
});
