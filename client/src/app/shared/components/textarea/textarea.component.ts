import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GetControlDirective } from '../../directives/get-control.directive';
import { showErrorMessage } from '../../utils/validators';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [NgClass, NgStyle],
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
  @ViewChild('textarea') public textarea!: ElementRef<HTMLTextAreaElement>;

  @Input() public placeholder = '';

  @Input({ required: true }) public label!: string;

  @Input({ required: true }) public withErrors!: boolean;

  @Input({ required: true }) public resizeX!: boolean;

  @Input({ required: true }) public resizeY!: boolean;

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
    if (this.textarea) {
      this.textarea.nativeElement.value = this.internalValue;
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

  public setStyle(): Record<string, string> {
    const resize = this.resizeX
      ? this.resizeY
        ? 'both'
        : 'horizontal'
      : this.resizeY
        ? 'vertical'
        : 'none';
    return { resize };
  }

  public markAsDirty(): void {
    this.control.markAsDirty();
    this.cdr.markForCheck();
  }
}
