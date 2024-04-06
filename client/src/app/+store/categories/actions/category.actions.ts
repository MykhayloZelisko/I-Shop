import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import { CreateCategoryType } from '../../../shared/models/types/create-category.type';

export const CategoryActions = createActionGroup({
  source: 'Category/API',
  events: {
    LoadCategories: emptyProps(),
    LoadCategoriesSuccess: props<{ categories: CategoryInterface[] }>(),
    LoadCategoriesFailure: emptyProps(),
    AddCategory: props<{ category: CreateCategoryType }>(),
    AddCategorySuccess: props<{ category: CategoryInterface }>(),
    AddCategoryFailure: emptyProps(),
    UpdateCategory: props<{ id: string; categoryName: string }>(),
    UpdateCategorySuccess: props<{ category: CategoryInterface }>(),
    UpdateCategoryFailure: emptyProps(),
    DeleteCategory: props<{ id: string }>(),
    DeleteCategorySuccess: props<{ ids: string[] }>(),
    DeleteCategoryFailure: emptyProps(),
    DeleteCategories: props<{ ids: string[] }>(),
    // ClearCategories: emptyProps(),
    OpenNewCategory: emptyProps(),
    CloseNewCategory: emptyProps(),
    SetCurrentCategoryId: props<{ categoryId: string }>(),
    ClearCurrentCategoryId: emptyProps(),
  },
});
