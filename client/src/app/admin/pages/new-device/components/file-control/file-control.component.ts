import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { NgStyle } from '@angular/common';
import { ImageConfigInterface } from '../../../../../shared/models/interfaces/image-config.interface';

@Component({
  selector: 'app-file-control',
  standalone: true,
  imports: [NgStyle],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileControlComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: FileControlComponent,
      multi: true,
    },
  ],
  templateUrl: './file-control.component.html',
  styleUrl: './file-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileControlComponent
  implements ControlValueAccessor, OnInit, Validator
{
  public file = input.required<File>();

  public uploadFile = output<string>();

  public imageConfig: ImageConfigInterface = {
    width: 0,
    height: 0,
  };

  public imageUrl = '';

  private cdr = inject(ChangeDetectorRef);

  public onChange = (_file: File): void => {};

  public onTouched = (): void => {};

  public registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(): void {
    return;
  }

  public ngOnInit(): void {
    this.readFile(this.file());
  }

  public readFile(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>): void => {
      this.imageUrl = e.target ? (e.target.result as string) : '';
      if (this.file().type.startsWith('image')) {
        this.uploadFile.emit(this.imageUrl);
      }
      this.onChange(file);
      this.cdr.markForCheck();
    };

    reader.readAsDataURL(file);
  }

  public getImageStyle(): Record<string, string> {
    return this.imageConfig.height > this.imageConfig.width
      ? { height: '100%' }
      : { width: '100%' };
  }

  public onImageLoad(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    this.imageConfig.width = imgElement.width;
    this.imageConfig.height = imgElement.height;
  }

  public validate(
    control: AbstractControl<File, File>,
  ): ValidationErrors | null {
    const file = control.value;

    if (file && !(file instanceof File)) {
      return { file: 'Дані не є файлом або файл пошкодженний' };
    } else if (file && file.size > 1024 * 1024) {
      return {
        fileSize: `Розмір файлу не повинен перевищувати 1МБ`,
      };
    } else if (file && !file.type.startsWith('image')) {
      return { fileType: `Завантажувати можна лише зображення` };
    }
    return null;
  }
}
