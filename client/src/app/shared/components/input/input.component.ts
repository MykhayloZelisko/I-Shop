import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule, ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';
import { showErrorMessage } from '../../utils/validators';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [PaginatorModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: InputComponent,
      multi: true,
    },
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent<T = string>
  implements ControlValueAccessor, Validator
{
  @Input() public placeholder = '';

  @Input() public inputType = 'text';

  @Input({ required: true }) public control!: FormControl<T>;

  @Input({ required: true }) public label!: string;

  @Input() public validators: ValidatorFn[] = [];

  public onChange = (_: T): void => {};

  public onTouched = (): void => {};

  public registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(): void {}

  public validate(control: AbstractControl<T, T>): ValidationErrors | null {
    if (this.validators.length) {
      let errors: ValidationErrors = {};
      for (const validator of this.validators) {
        const result = validator(control);
        if (result) {
          errors = { ...errors, ...result };
        }
      }
      return errors;
    }
    return null;
  }

  public showMessage(): string {
    return showErrorMessage(this.control);
  }
}
