import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ValidatorFn,
} from '@angular/forms';
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
  implements OnInit, ControlValueAccessor
{
  @ViewChild('textarea') public textarea!: ElementRef;

  @Input() public placeholder = '';

  @Input({ required: true }) public label!: string;

  @Input() public validators: ValidatorFn[] = [];

  @Input({ required: true }) public withErrors!: boolean;

  @Input({ required: true }) public resizeX!: boolean;

  @Input({ required: true }) public resizeY!: boolean;

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
    if (this.textarea) {
      this.textarea.nativeElement.value = value;
    }
    this.control.updateValueAndValidity();
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
    this.cdr.detectChanges();
  }
}
