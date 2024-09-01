import { FormControl } from '@angular/forms';

export interface RegistrationFormInterface {
  email: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  phone: FormControl<string>;
  password: FormControl<string>;
}
