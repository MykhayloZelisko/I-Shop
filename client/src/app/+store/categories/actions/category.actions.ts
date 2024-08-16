import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import { CurrentCategoryStatusInterface } from '../../../shared/models/interfaces/current-category-status.interface';
import { CreateCategoryInterface } from '../../../shared/models/interfaces/create-category.interface';
import { UpdateCategoryInterface } from '../../../shared/models/interfaces/update-category.interface';
import { CreateCPropertyInterface } from '../../../shared/models/interfaces/create-c-property.interface';

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
    // Other actions
    OpenNewCategory: emptyProps(),
    CloseNewCategory: emptyProps(),
    ChangeCurrentCategoryStatus: props<{
      categoryStatus: CurrentCategoryStatusInterface;
    }>(),
  },
});
