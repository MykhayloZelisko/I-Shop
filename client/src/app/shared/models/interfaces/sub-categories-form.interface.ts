import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface SubCategoriesFormInterface {
  categories: FormArray<FormGroup<SubCategoryFormInterface>>;
}

export interface SubCategoryFormInterface {
  categoryName: FormControl<string>;
  image: FormControl<File>;
  parentId: FormControl<string | null>;
}
