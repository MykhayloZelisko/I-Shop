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
import { DndDirective } from '../../directives/dnd.directive';
import { NgClass, NgStyle } from '@angular/common';
import { ImageConfigInterface } from '../../models/interfaces/image-config.interface';
import { GetControlDirective } from '../../directives/get-control.directive';

@Component({
  selector: 'app-dnd-file-control',
  standalone: true,
  imports: [DndDirective, NgStyle, NgClass],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DndFileControlComponent,
      multi: true,
    },
  ],
  templateUrl: './dnd-file-control.component.html',
  styleUrl: './dnd-file-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DndFileControlComponent
  extends GetControlDirective
  implements OnInit, ControlValueAccessor
{
  @ViewChild('fileUpload') public fileUpload!: ElementRef<HTMLInputElement>;

  @HostListener('change', ['$event.target.files'])
  private emitFiles(event: FileList): void {
    this.errorMessage = '';
    const file = event.item(0);
    if (file) {
      this.validateFiles([file]);
      this.readFile(file);
    } else {
      this.errorMessage = `Зображення є обов'язковим`;
      this.fileName = '';
      this.imageUrl = null;
      this.onChange(this.imageUrl);
    }
    this.onTouched();
  }

  public imageUrl: string | null = null;

  public imageConfig: ImageConfigInterface = {
    width: 0,
    height: 0,
  };

  public errorMessage = '';

  public fileName = '';

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

  public writeValue(): void {
    return;
  }

  public setInputFile(files: FileList): void {
    const filesArray: File[] = [];
    for (let i = 0; i < files.length; i++) {
      filesArray.push(files.item(i) as File);
    }
    this.validateFiles(filesArray);
    this.readFile(filesArray[0]);
  }

  public validateFiles(files: File[]): void {
    if (this.imageUrl) {
      if (files.length > 1) {
        this.errorMessage = 'Завантажувати можна лише один файл';
      } else if (files[0] && !(files[0] instanceof File)) {
        this.errorMessage = 'Дані не є файлом або файл пошкодженний';
      } else if (files[0] && files[0].size > 1024 * 1024) {
        this.errorMessage = 'Розмір файлу не повинен перевищувати 1МБ';
      } else if (files[0] && !files[0].type.startsWith('image')) {
        this.errorMessage = 'Завантажувати можна лише зображення';
      }
    } else {
      if (!files.length) {
        this.errorMessage = `Зображення є обов'язковим`;
      } else if (files.length > 1) {
        this.errorMessage = 'Завантажувати можна лише один файл';
      } else if (!(files[0] instanceof File)) {
        this.errorMessage = 'Дані не є файлом або файл пошкодженний';
      } else if (files[0].size > 1024 * 1024) {
        this.errorMessage = 'Розмір файлу не повинен перевищувати 1МБ';
      } else if (!files[0].type.startsWith('image')) {
        this.errorMessage = 'Завантажувати можна лише зображення';
      }
    }
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

  public readFile(file: File): void {
    if (!this.errorMessage) {
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = (): void => {
        this.imageUrl = reader.result as string;
        this.onChange(this.imageUrl);
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(file);
    } else {
      this.fileName = '';
      this.imageUrl = null;
      this.onChange(this.imageUrl);
    }
  }

  public triggerFileInput(): void {
    this.fileUpload.nativeElement.click();
    if (!this.control.value) {
      this.onChange('');
      this.errorMessage = `Зображення є обов'язковим`;
    }
  }
}
