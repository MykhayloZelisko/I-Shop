import { FormControl } from '@angular/forms';

export interface LoginFormInterface {
  email: FormControl<string>;
  password: FormControl<string>;
}
