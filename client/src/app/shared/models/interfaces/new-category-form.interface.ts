import { FormControl } from '@angular/forms';

export interface NewCategoryFormInterface {
  categoryName: FormControl<string>;
  icon: FormControl<string>;
}
