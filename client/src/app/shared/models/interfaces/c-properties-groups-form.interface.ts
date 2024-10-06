import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface CPropertiesGroupsFormInterface {
  groups: FormArray<FormGroup<CPropertiesGroupFormInterface>>;
}

export interface CPropertiesGroupFormInterface {
  groupName: FormControl<string>;
  categoryId: FormControl<string>;
}
