import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface CheckoutFormInterface {
  contactInfo: FormGroup<ContactInfoFormInterface>;
  recipient: FormGroup<RecipientFormInterface>;
  totalPrice: FormControl<number>;
  devices: FormArray<FormGroup<OrderedDeviceFormInterface>>;
}

export interface ContactInfoFormInterface {
  phone: FormControl<string>;
  email: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
}

export interface RecipientFormInterface {
  phone: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  patronymic: FormControl<string>;
}

export interface OrderedDeviceFormInterface {
  id: FormControl<string>;
  priceAtAdd: FormControl<number>;
  quantity: FormControl<number>;
}
