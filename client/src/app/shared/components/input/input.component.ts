import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  inject,
  Injector,
  Input,
  OnInit, Output,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgModel,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { Subject, takeUntil, tap } from 'rxjs';
import { showErrorMessage } from '../../utils/validators';
import { NgClass } from '@angular/common';
import { MaskConfigInterface } from '../../models/interfaces/mask-config.interface';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgxMaskDirective],
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
export class InputComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input') public input!: ElementRef;

  @Input() public placeholder = '';

  @Input() public inputType = 'text';

  @Input({ required: true }) public label!: string;

  @Input() public validators: ValidatorFn[] = [];

  @Input() public maskConfig!: MaskConfigInterface;

  @Output() public focusEvent: EventEmitter<void> = new EventEmitter<void>();

  public control!: FormControl<unknown>;

  public onChange = (_: unknown): void => {};

  public onTouched = (): void => {};

  private destroy$: Subject<void> = new Subject<void>();

  private injector = inject(Injector);

  private cdr = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.setComponentControl();
  }

  public registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(): void {
    if (this.input) {
      this.input.nativeElement.value = '';
    }
    this.cdr.detectChanges();
  }

  public setComponentControl(): void {
    const injectedControl = this.injector.get(NgControl);

    switch (injectedControl.constructor) {
      case NgModel: {
        const { control, update } = injectedControl as NgModel;
        this.control = control;
        this.control.valueChanges
          .pipe(
            tap((value: unknown) => update.emit(value)),
            takeUntil(this.destroy$),
          )
          .subscribe();
        break;
      }
      case FormControlName: {
        this.control = this.injector
          .get(FormGroupDirective)
          .getControl(injectedControl as FormControlName);
        break;
      }
      default: {
        this.control = (injectedControl as FormControlDirective)
          .form as FormControl;
        break;
      }
    }
    if (this.validators.length) {
      this.control.setValidators(this.validators);
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

  public isInvalid(): boolean {
    return this.control.invalid && (this.control.dirty || this.control.touched);
  }

  protected readonly onfocus = onfocus;

  public onFocus(): void {
    this.focusEvent.emit();
  }
}
