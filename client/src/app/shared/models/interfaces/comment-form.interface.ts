import { FormControl } from '@angular/forms';

export interface CommentFormInterface {
  rating: FormControl<number>;
  advantages: FormControl<string>;
  disadvantages: FormControl<string>;
  comment: FormControl<string>;
}
