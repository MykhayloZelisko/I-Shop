import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SvgIconComponent } from 'angular-svg-icon';
import { NgClass } from '@angular/common';
import { GetControlDirective } from '../../../../directives/get-control.directive';
import { showErrorMessage } from '../../../../utils/validators';

@Component({
  selector: 'app-rating-control',
  standalone: true,
  imports: [SvgIconComponent, NgClass],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RatingControlComponent,
      multi: true,
    },
  ],
  templateUrl: './rating-control.component.html',
  styleUrl: './rating-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingControlComponent
  extends GetControlDirective
  implements ControlValueAccessor, OnInit
{
  public readonly ratingValues: number[] = [5, 4, 3, 2, 1];

  public rating!: number;

  public hoverRating = 0;

  public activeRating = 0;

  public onChange = (_: number): void => {};

  public onTouched = (): void => {};

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
    this.rating = Number(this.control.value) ?? 0;
    this.activeRating = this.rating;
  }

  public changeRating(rate: number): void {
    this.rating = rate;
    this.onChange(rate);
    this.onTouched();
  }

  public onMouseEnter(n: number): void {
    this.hoverRating = n;
    this.activeRating = 0;
  }

  public onMouseLeave(): void {
    this.hoverRating = 0;
    this.activeRating = this.rating;
  }

  public isInvalid(): boolean {
    return this.control.invalid && (this.control.dirty || this.control.touched);
  }

  public showMessage(): string {
    return showErrorMessage(this.control);
  }

  public markAsDirty(): void {
    this.control.markAsDirty();
    this.cdr.detectChanges();
  }
}
