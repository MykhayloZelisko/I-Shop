import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface NewDeviceFormInterface {
  deviceName: FormControl<string>;
  price: FormControl<number | null>;
  count: FormControl<number | null>;
  images: FormArray<FormControl<File>>;
  base64images: FormArray<FormControl<string>>;
  categoryId: FormControl<string>;
  brandId: FormControl<string>;
  groups: FormArray<FormGroup<DPropertiesGroupFormInterface>>;
}

export interface DPropertiesGroupFormInterface {
  groupName: FormControl<string>;
  properties: FormArray<FormGroup<DPropertyFormInterface>>;
}

export interface DPropertyFormInterface {
  propertyName: FormControl<string>;
  value: FormControl<string>;
}
