import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { Select } from 'primeng/select';
import { GetControlDirective } from '../../directives/get-control.directive';
import { v4 as uuidV4 } from 'uuid';
import { showErrorMessage } from '../../utils/validators';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-select',
  imports: [ReactiveFormsModule, Select, NgStyle, NgClass],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectComponent,
      multi: true,
    },
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent
  extends GetControlDirective
  implements ControlValueAccessor
{
  public placeholder = input<string>('');

  public label = input.required<string>();

  public withErrors = input.required<boolean>();

  public options = input.required<unknown[]>();

  public optionLabel = input.required<string>();

  public optionValue = input.required<string>();

  public readonly id = uuidV4();

  public onChange = (_: unknown): void => {};

  public onTouched = (): void => {};

  public registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(): void {
    return;
  }

  public showMessage(): string {
    return showErrorMessage(this.control);
  }

  public changeValue(): void {
    this.onChange(this.control.value);
  }

  public onBlur(): void {
    this.onTouched();
  }

  public setHeight(): Record<string, string> {
    return this.withErrors() ? { height: '78px' } : { height: '62px' };
  }
}
