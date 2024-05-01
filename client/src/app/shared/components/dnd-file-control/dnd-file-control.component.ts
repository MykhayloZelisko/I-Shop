import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  Input,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { DndDirective } from '../../directives/dnd.directive';
import { NgClass, NgStyle } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { SubCategoryFormInterface } from '../../models/interfaces/sub-categories-form.interface';
import { showErrorMessage } from '../../utils/validators';

@Component({
  selector: 'app-dnd-file-control',
  standalone: true,
  imports: [DndDirective, NgStyle, NgClass, SvgIconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DndFileControlComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: DndFileControlComponent,
      multi: true,
    },
  ],
  templateUrl: './dnd-file-control.component.html',
  styleUrl: './dnd-file-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DndFileControlComponent
  implements ControlValueAccessor, Validator
{
  @Input({ required: true }) public form!: FormGroup<SubCategoryFormInterface>;

  @HostListener('change', ['$event.target.files'])
  private emitFiles(event: FileList): void {
    const files: File[] | null = event ? [] : null;
    if (event && files) {
      for (let i = 0; i < event.length; i++) {
        files.push(event.item(i) as File);
      }
    }
    this.onChange(files);
    if (files) {
      this.setImageUrl(files);
    }
  }

  public fileUrl = '';

  public fileName = '';

  public imageWidth = 0;

  public imageHeight = 0;

  private cdr = inject(ChangeDetectorRef);

  public onChange = (_: File[] | null): void => {};

  public onTouched = (): void => {};

  public registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(): void {
    const input = document.getElementById('file-input') as HTMLInputElement;
    input.value = '';
  }

  public setInputFile(files: FileList): void {
    const filesArray: File[] = [];
    for (let i = 0; i < files.length; i++) {
      filesArray.push(files.item(i) as File);
    }
    this.setImageUrl(filesArray);
    this.onChange(filesArray);
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    const files = control.value;
    if (files) {
      if (!files.length) {
        return { required: `Зображення є обов'язковим` };
      } else if (files.length > 1) {
        return { oneFile: 'Завантажувати можна лише один файл' };
      } else if (!(files[0] instanceof File)) {
        return { file: 'Дані не є файлом або файл пошкодженний' };
      } else if (files[0].size > 1024 * 1024) {
        return {
          fileSize: `Розмір файлу не повинен перевищувати 1кБ`,
        };
      } else if (!files[0].type.startsWith('image')) {
        return { fileType: `Завантажувати можна лише зображення` };
      }
    } else {
      return { required: `Зображення є обов'язковим` };
    }
    return null;
  }

  public setImageUrl(files: File[]): void {
    this.fileUrl = '';
    if (
      files &&
      files.length === 1 &&
      files[0] instanceof File &&
      files[0].type.startsWith('image')
    ) {
      this.fileName = files[0].name;
      const reader = new FileReader();
      reader.onload = (): void => {
        this.fileUrl = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(files[0]);
    }
  }

  public onImageLoad(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    this.imageWidth = imgElement.width;
    this.imageHeight = imgElement.height;
  }

  public getImageStyle(): Record<string, string> {
    return this.imageHeight > this.imageWidth
      ? { height: '100%' }
      : { width: '100%' };
  }

  public deleteImage(): void {
    this.fileUrl = '';
    this.onChange(null);
  }

  public showMessage(control: AbstractControl): string {
    return showErrorMessage(control);
  }
}
