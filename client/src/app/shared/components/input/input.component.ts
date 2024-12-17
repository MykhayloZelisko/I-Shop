import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
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
  @ViewChild('input') public input!: ElementRef<HTMLInputElement>;

  @Input() public placeholder = '';

  @Input() public inputType = 'text';

  @Input({ required: true }) public label!: string;

  @Input({ required: true }) public withErrors!: boolean;

  @Output() public focusEvent: EventEmitter<void> = new EventEmitter<void>();

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
    if (this.input) {
      this.input.nativeElement.value = value;
      this.internalValue = value;
      this.cdr.markForCheck();
    }
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
    return this.withErrors ? { height: '78px' } : { height: '62px' };
  }

  public markAsDirty(): void {
    this.control.markAsDirty();
    this.cdr.markForCheck();
  }

  public onFocus(): void {
    this.focusEvent.emit();
  }
}
