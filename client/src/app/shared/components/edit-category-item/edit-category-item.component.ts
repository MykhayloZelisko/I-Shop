import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DndFileControlComponent } from '../dnd-file-control/dnd-file-control.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SubCategoryFormInterface } from '../../models/interfaces/sub-categories-form.interface';
import { NgClass, NgStyle } from '@angular/common';
import { ImageConfigInterface } from '../../models/interfaces/image-config.interface';
import { requiredValidator } from '../../utils/validators';
import { CategoryFormDataInterface } from '../../models/interfaces/category-form-data.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit-category-item',
  standalone: true,
  imports: [
    DndFileControlComponent,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgStyle,
  ],
  templateUrl: './edit-category-item.component.html',
  styleUrl: './edit-category-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCategoryItemComponent implements OnInit, OnDestroy {
  @ViewChild(DndFileControlComponent)
  public child!: DndFileControlComponent;

  @Input({ required: true }) public category!: CategoryFormDataInterface;

  @Output() public changeFormValue: EventEmitter<CategoryFormDataInterface> =
    new EventEmitter<CategoryFormDataInterface>();

  public categoryForm!: FormGroup<SubCategoryFormInterface>;

  public imageConfig: ImageConfigInterface = {
    width: 0,
    height: 0,
  };

  private fb = inject(FormBuilder);

  private destroy$: Subject<void> = new Subject<void>();

  public ngOnInit(): void {
    this.initForm();
    this.onChangeFormValue();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public initForm(): void {
    this.categoryForm = this.fb.group<SubCategoryFormInterface>({
      categoryName: this.fb.nonNullable.control<string>(
        this.category.categoryName,
        [requiredValidator()],
      ),
      image: this.fb.nonNullable.control<File[]>(this.category.image),
      parentId: this.fb.control<string | null>(this.category.parentId, [
        requiredValidator(),
      ]),
      level: this.fb.nonNullable.control<number>(this.category.level, [
        requiredValidator(),
      ]),
      base64image: this.fb.control<string | null>(null, [requiredValidator()]),
    });
  }

  public onChangeFormValue(): void {
    this.changeFormValue.emit({ ...this.category, base64image: null });
    this.categoryForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        const value = this.categoryForm.getRawValue();
        const newValue = {
          ...value,
          parentId: this.category.parentId,
          level: this.category.level,
        };
        this.changeFormValue.emit(newValue);
      },
    });
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

  public deleteImage(): void {
    if (this.child) {
      this.child.deleteImage();
      this.imageConfig = { height: 0, width: 0 };
    }
  }

  public setImageUrl(value: string | null): void {
    this.categoryForm.controls.base64image.setValue(value);
  }

  public getImageUrl(): string {
    return this.categoryForm.controls.base64image.value
      ? this.categoryForm.controls.base64image.value
      : this.category && this.category.base64image
        ? this.category.base64image
        : '';
  }
}
