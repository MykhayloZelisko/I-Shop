import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface NewDeviceFormInterface {
  deviceName: FormControl<string>;
  price: FormControl<number>;
  count: FormControl<number>;
  images: FormArray<FormControl<File>>;
  base64images: FormArray<FormControl<string>>;
  categoryId: FormControl<string>;
  brandId: FormControl<string>;
  properties: FormArray<FormGroup<DPropertyFormInterface>>;
}

export interface DPropertyFormInterface {
  propertyName: FormControl<string>;
  value: FormControl<string>;
}
