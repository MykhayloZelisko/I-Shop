import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
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
import { SubCategoryFormInterface } from '../../models/interfaces/sub-categories-form.interface';
import { showErrorMessage } from '../../utils/validators';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-dnd-file-control',
  standalone: true,
  imports: [DndDirective, JsonPipe],
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

  @Input({ required: true }) public imageUrl: string | null = null;

  @Input({ required: true }) public parentId: string | null = null;

  @Output() public changeImage: EventEmitter<string | null> = new EventEmitter<
    string | null
  >();

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

  public fileName = '';

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

  public validate(
    control: AbstractControl<File[], File[]>,
  ): ValidationErrors | null {
    const files = control.value;
    if (this.imageUrl) {
      if (files.length > 1) {
        return { oneFile: 'Завантажувати можна лише один файл' };
      } else if (files[0] && !(files[0] instanceof File)) {
        return { file: 'Дані не є файлом або файл пошкодженний' };
      } else if (files[0] && files[0].size > 1024 * 1024) {
        return {
          fileSize: `Розмір файлу не повинен перевищувати 1МБ`,
        };
      } else if (files[0] && !files[0].type.startsWith('image')) {
        return { fileType: `Завантажувати можна лише зображення` };
      }
    } else if (this.parentId) {
      if (!files.length) {
        return { required: `Зображення є обов'язковим` };
      } else if (files.length > 1) {
        return { oneFile: 'Завантажувати можна лише один файл' };
      } else if (!(files[0] instanceof File)) {
        return { file: 'Дані не є файлом або файл пошкодженний' };
      } else if (files[0].size > 1024 * 1024) {
        return {
          fileSize: `Розмір файлу не повинен перевищувати 1МБ`,
        };
      } else if (!files[0].type.startsWith('image')) {
        return { fileType: `Завантажувати можна лише зображення` };
      }
    }
    return null;
  }

  public setImageUrl(files: File[]): void {
    let fileUrl: string | null = null;
    if (
      files &&
      files.length === 1 &&
      files[0] instanceof File &&
      files[0].type.startsWith('image')
    ) {
      this.fileName = files[0].name;
      const reader = new FileReader();
      reader.onload = (): void => {
        fileUrl = reader.result as string;
        this.changeImage.emit(fileUrl);
      };
      reader.readAsDataURL(files[0]);
    } else {
      this.changeImage.emit(fileUrl);
    }
  }

  public deleteImage(): void {
    this.onChange([]);
    this.changeImage.emit(null);
    this.fileName = '';
  }

  public showMessage(control: AbstractControl): string {
    return showErrorMessage(control);
  }
}
