import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface CPropertiesFormInterface {
  properties: FormArray<FormGroup<CPropertyFormInterface>>;
}

export interface CPropertyFormInterface {
  propertyName: FormControl<string>;
  groupId: FormControl<string>;
}
