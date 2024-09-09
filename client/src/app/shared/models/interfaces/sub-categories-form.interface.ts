import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface SubCategoriesFormInterface {
  categories: FormArray<FormGroup<CategoryFormInterface>>;
}

export interface CategoryFormInterface {
  categoryName: FormControl<string>;
  image: FormControl<string | null>;
  icon: FormControl<string | null>;
  parentId: FormControl<string | null>;
  level: FormControl<number>;
}
