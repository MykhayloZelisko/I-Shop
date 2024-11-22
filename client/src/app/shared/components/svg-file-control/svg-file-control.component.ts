import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SvgIconComponent } from 'angular-svg-icon';
import { NgClass } from '@angular/common';
import { GetControlDirective } from '../../directives/get-control.directive';

@Component({
  selector: 'app-svg-file-control',
  standalone: true,
  imports: [SvgIconComponent, NgClass],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SvgFileControlComponent,
      multi: true,
    },
  ],
  templateUrl: './svg-file-control.component.html',
  styleUrl: './svg-file-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgFileControlComponent
  extends GetControlDirective
  implements ControlValueAccessor, OnInit
{
  @ViewChild('fileUpload') public fileUpload!: ElementRef<HTMLInputElement>;

  @HostListener('change', ['$event.target.files'])
  private handleFileInput(event: FileList): void {
    const file = event.item(0);
    if (
      file instanceof File &&
      file.type === 'image/svg+xml' &&
      file.size <= 1024 * 1024
    ) {
      const reader = new FileReader();
      reader.onload = (): void => {
        this.imageUrl = reader.result as string;
        this.onChange(this.imageUrl);
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(file);
    } else {
      this.imageUrl = null;
      this.onChange(this.imageUrl);
    }
    this.onTouched();
  }

  public imageUrl: string | null = null;

  public onChange = (_: string | null): void => {};

  public onTouched = (): void => {};

  private cdr = inject(ChangeDetectorRef);

  public override ngOnInit(): void {
    super.ngOnInit();
    this.imageUrl =
      typeof this.control.value === 'string' ? this.control.value : null;
  }

  public registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(): void {}

  public triggerFileInput(): void {
    this.fileUpload.nativeElement.click();
    if (!this.control.value) {
      this.onChange('');
    }
  }
}
