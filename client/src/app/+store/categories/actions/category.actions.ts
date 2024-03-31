import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';

export const CategoryActions = createActionGroup({
  source: 'Category/API',
  events: {
    LoadCategories: emptyProps(),
    LoadCategoriesSuccess: props<{ categories: CategoryInterface[] }>(),
    LoadCategoriesFailure: emptyProps(),
    // AddCategory: props<{ category: CategoryInterface }>(), // add without checking id
    // UpsertCategory: props<{ category: CategoryInterface }>(), // add with checking id
    // AddCategories: props<{ categories: CategoryInterface[] }>(),
    // UpsertCategories: props<{ categories: CategoryInterface[] }>(),
    // UpdateCategory: props<{ category: Update<CategoryInterface> }>(),
    // UpdateCategories: props<{ categories: Update<CategoryInterface>[] }>(),
    // DeleteCategory: props<{ id: string }>(),
    // DeleteCategories: props<{ ids: string[] }>(),
    // ClearCategories: emptyProps(),
  },
});
