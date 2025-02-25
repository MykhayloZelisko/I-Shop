import { FormControl, FormGroup } from '@angular/forms';

export interface CheckoutFormInterface {
  contactInfo: FormGroup<ContactInfoFormInterface>;
  recipient: FormGroup<RecipientFormInterface>;
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
