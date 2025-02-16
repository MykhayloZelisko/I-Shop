import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  output,
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
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule, NgClass, NgStyle, NgxMaskDirective],
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

  public mask = input<string>();

  public prefix = input<string>('');

  public showMaskTyped = input<boolean>(false);

  public dropSpecialCharacters = input<boolean>(false);

  public thousandSeparator = input<string>('');

  public decimalMarker = input<'.' | ',' | ['.', ',']>('.');

  public label = input.required<string>();

  public withErrors = input.required<boolean>();

  public focusEvent = output<void>();

  public readonly id = uuidV4();

  public onChange = (_: unknown): void => {};

  public onTouched = (): void => {};

  private cdr = inject(ChangeDetectorRef);

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
