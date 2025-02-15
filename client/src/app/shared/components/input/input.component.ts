import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { showErrorMessage } from '../../utils/validators';
import { NgClass, NgStyle } from '@angular/common';
import { GetControlDirective } from '../../directives/get-control.directive';

import { v4 as uuidV4 } from 'uuid';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule, NgClass, NgStyle],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputComponent,
      multi: true,
    },
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent
  extends GetControlDirective
  implements ControlValueAccessor
{
  public placeholder = input<string>('');

  public inputType = input<string>('text');

  public label = input.required<string>();

  public withErrors = input.required<boolean>();

  public focusEvent = output<void>();

  public readonly id = uuidV4();

  public internalValue: WritableSignal<string> = signal<string>('');

  public onChange = (_: unknown): void => {};

  public onTouched = (): void => {};

  private cdr = inject(ChangeDetectorRef);

  public registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(value: string): void {
    this.internalValue.set(value);
  }

  public showMessage(): string {
    return showErrorMessage(this.control);
  }

  public changeValue($event: Event): void {
    this.internalValue.set(($event.target as HTMLInputElement).value);
    this.onChange(this.internalValue());
  }

  public onBlur(): void {
    this.onTouched();
  }

  public setHeight(): Record<string, string> {
    return this.withErrors() ? { height: '78px' } : { height: '62px' };
  }

  public markAsDirty(): void {
    this.control.markAsDirty();
    this.cdr.markForCheck();
  }

  public markAsPristine(): void {
    this.control.markAsPristine();
    this.cdr.markForCheck();
  }

  public onFocus(): void {
    this.focusEvent.emit();
  }
}
