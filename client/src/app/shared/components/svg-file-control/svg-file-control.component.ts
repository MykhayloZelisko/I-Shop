import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SvgIconComponent } from 'angular-svg-icon';
import { NgClass } from '@angular/common';
import { GetControlDirective } from '../../directives/get-control.directive';

@Component({
  selector: 'app-svg-file-control',
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
  public fileUpload =
    viewChild.required<ElementRef<HTMLInputElement>>('fileUpload');

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
        this.imageUrl.set(reader.result as string);
        this.onChange(this.imageUrl());
      };
      reader.readAsDataURL(file);
    } else {
      this.imageUrl.set(null);
      this.onChange(this.imageUrl());
    }
    this.onTouched();
  }

  public imageUrl: WritableSignal<string | null> = signal<string | null>(null);

  public onChange = (_: string | null): void => {};

  public onTouched = (): void => {};

  public override ngOnInit(): void {
    super.ngOnInit();
    this.imageUrl.set(
      typeof this.control.value === 'string' ? this.control.value : null,
    );
  }

  public registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(): void {
    return;
  }

  public triggerFileInput(): void {
    this.fileUpload().nativeElement.click();
    if (!this.control.value) {
      this.onChange('');
    }
  }
}
