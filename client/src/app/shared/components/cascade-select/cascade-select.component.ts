import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CascadeSelect, CascadeSelectChangeEvent } from 'primeng/cascadeselect';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { GetControlDirective } from '../../directives/get-control.directive';
import { v4 as uuidV4 } from 'uuid';
import { showErrorMessage } from '../../utils/validators';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-cascade-select',
  imports: [CascadeSelect, ReactiveFormsModule, NgStyle, NgClass],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CascadeSelectComponent,
      multi: true,
    },
  ],
  templateUrl: './cascade-select.component.html',
  styleUrl: './cascade-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CascadeSelectComponent
  extends GetControlDirective
  implements ControlValueAccessor
{
  public placeholder = input<string>('');

  public label = input.required<string>();

  public withErrors = input.required<boolean>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public options = input.required<any[]>();

  public optionLabel = input.required<string>();

  public optionGroupLabel = input.required<string>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public optionGroupChildren = input.required<any>();

  public optionValue = input.required<string>();

  public changeEvent = output<CascadeSelectChangeEvent>();

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

  public changeValue(event: CascadeSelectChangeEvent): void {
    this.onChange(this.control.value);
    this.changeEvent.emit(event);
  }

  public onBlur(): void {
    this.onTouched();
  }

  public setHeight(): Record<string, string> {
    return this.withErrors() ? { height: '78px' } : { height: '62px' };
  }
}
