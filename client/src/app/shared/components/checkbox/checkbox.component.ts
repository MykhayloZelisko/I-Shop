import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { v4 as uuidV4 } from 'uuid';
import { SvgIconComponent } from 'angular-svg-icon';
import { GetControlDirective } from '../../directives/get-control.directive';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [SvgIconComponent],
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
  @ViewChild('checkbox') public checkbox!: ElementRef<HTMLInputElement>;

  @Output() public changeEvent: EventEmitter<void> = new EventEmitter<void>();

  public checkboxId!: string;

  public onTouched = (): void => {};

  public onChange = (_: boolean | null): void => {};

  private cdr = inject(ChangeDetectorRef);

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
    this.cdr.markForCheck();
  }

  public changeValue(event: Event): void {
    const value = (event.target as HTMLInputElement).checked;
    this.onChange(value);
    this.changeEvent.emit();
    this.onTouched();
  }
}
