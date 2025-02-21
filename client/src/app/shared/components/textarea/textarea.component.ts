import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { GetControlDirective } from '../../directives/get-control.directive';
import { showErrorMessage } from '../../utils/validators';
import { NgClass, NgStyle } from '@angular/common';
import { v4 as uuidV4 } from 'uuid';

@Component({
  selector: 'app-textarea',
  imports: [NgClass, NgStyle, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TextareaComponent,
      multi: true,
    },
  ],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent
  extends GetControlDirective
  implements ControlValueAccessor
{
  public placeholder = input<string>('');

  public label = input.required<string>();

  public withErrors = input.required<boolean>();

  public resizeX = input.required<boolean>();

  public resizeY = input.required<boolean>();

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

  public setStyle(): Record<string, string> {
    const resize = this.resizeX()
      ? this.resizeY()
        ? 'both'
        : 'horizontal'
      : this.resizeY()
        ? 'vertical'
        : 'none';
    return { resize };
  }
}
