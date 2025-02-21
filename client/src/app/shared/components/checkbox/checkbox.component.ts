import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  output,
} from '@angular/core';
import { v4 as uuidV4 } from 'uuid';
import { SvgIconComponent } from 'angular-svg-icon';
import { GetControlDirective } from '../../directives/get-control.directive';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';

@Component({
  selector: 'app-checkbox',
  imports: [ReactiveFormsModule, SvgIconComponent, Checkbox],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CheckboxComponent,
      multi: true,
    },
  ],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent
  extends GetControlDirective
  implements OnInit, ControlValueAccessor
{
  public changeEvent = output<void>();

  public checkboxId!: string;

  public onTouched = (): void => {};

  public onChange = (_: boolean | null): void => {};

  public override ngOnInit(): void {
    super.ngOnInit();
    this.checkboxId = uuidV4();
  }

  public registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(_: boolean | null): void {
    return;
  }

  public changeValue(): void {
    const value = this.control.value === null ? null : !!this.control.value;
    this.onChange(value);
    this.changeEvent.emit();
    this.onTouched();
  }
}
