import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
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
  standalone: true,
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
  public inputComp = viewChild.required<ElementRef<HTMLInputElement>>('input');

  public placeholder = input<string>('');

  public inputType = input<string>('text');

  public label = input.required<string>();

  public withErrors = input.required<boolean>();

  public focusEvent = output<void>();

  public readonly id = uuidV4();

  public internalValue: string | null = null;

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
    this.internalValue = value;
    if (this.inputComp()) {
      this.inputComp().nativeElement.value = value;
    }
    this.cdr.markForCheck();
  }

  public showMessage(): string {
    return showErrorMessage(this.control);
  }

  public changeValue($event: Event): void {
    const value = ($event.target as HTMLInputElement).value;
    this.onChange(value);
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

  public onFocus(): void {
    this.focusEvent.emit();
  }
}
