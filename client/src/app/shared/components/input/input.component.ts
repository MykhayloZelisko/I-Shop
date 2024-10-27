import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { showErrorMessage } from '../../utils/validators';
import { NgClass, NgStyle } from '@angular/common';
import { GetControlDirective } from '../../directives/get-control.directive';

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
  implements OnInit, ControlValueAccessor
{
  @ViewChild('input') public input!: ElementRef;

  @Input() public placeholder = '';

  @Input() public inputType = 'text';

  @Input({ required: true }) public label!: string;

  @Input() public validators: ValidatorFn[] = [];

  @Input({ required: true }) public withErrors!: boolean;

  @Output() public focusEvent: EventEmitter<void> = new EventEmitter<void>();

  public internalValue: string | null = null;

  public onChange = (_: unknown): void => {};

  public onTouched = (): void => {};

  private cdr = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.setComponentControl();
    if (this.validators.length) {
      this.control.setValidators(this.validators);
    }
  }

  public registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(value: unknown): void {
    this.internalValue = value as string | null;
    if (this.input) {
      this.input.nativeElement.value = this.internalValue;
    }
    this.cdr.detectChanges();
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

  public isInvalid(): boolean {
    return this.control.invalid && (this.control.dirty || this.control.touched);
  }

  public setHeight(): Record<string, string> {
    return this.withErrors ? { height: '78px' } : { height: '62px' };
  }

  public markAsDirty(): void {
    this.control.markAsDirty();
    this.cdr.detectChanges();
  }

  public onFocus(): void {
    this.focusEvent.emit();
  }
}
