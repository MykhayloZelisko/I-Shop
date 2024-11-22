import { FormControl } from '@angular/forms';

export interface CartDeviceFormInterface {
  quantity: FormControl<number>;
  isInOrder: FormControl<boolean>;
}
