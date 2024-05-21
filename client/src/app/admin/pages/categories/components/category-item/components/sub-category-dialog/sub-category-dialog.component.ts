import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { ClickOutsideDirective } from '../../../../../../../shared/directives/click-outside.directive';
import { SvgIconComponent } from 'angular-svg-icon';
import { PopupDataInterface } from '../../../../../../../shared/models/interfaces/popup-data.interface';
import { Store } from '@ngrx/store';
import { State } from '../../../../../../../+store/reducers';
import { PopupTypeEnum } from '../../../../../../../shared/models/enums/popup-type.enum';
import { CategoryActions } from '../../../../../../../+store/categories/actions/category.actions';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { requiredValidator } from '../../../../../../../shared/utils/validators';
import {
  SubCategoriesFormInterface,
  SubCategoryFormInterface,
} from '../../../../../../../shared/models/interfaces/sub-categories-form.interface';
import { CreateCategoryInterface } from '../../../../../../../shared/models/interfaces/create-category.interface';
import { EditCategoryItemComponent } from '../../../../../../../shared/components/edit-category-item/edit-category-item.component';
import { CategoryFormDataInterface } from '../../../../../../../shared/models/interfaces/category-form-data.interface';
import { PopupActions } from '../../../../../../../+store/popup/actions/popup.actions';

@Component({
  selector: 'app-sub-category-dialog',
  standalone: true,
  imports: [
    ClickOutsideDirective,
    SvgIconComponent,
    ReactiveFormsModule,
    EditCategoryItemComponent,
  ],
  templateUrl: './sub-category-dialog.component.html',
  styleUrl: './sub-category-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubCategoryDialogComponent implements OnInit {
  @Input({ required: true }) public dialog!: PopupDataInterface;

  @Input({ required: true }) public parentId!: string;

  public subCategoriesForm!: FormGroup<SubCategoriesFormInterface>;

  public categoryData!: CategoryFormDataInterface;

  private store = inject(Store<State>);

  private fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.initSubCategoriesForm();
    this.categoryData = {
      base64image: null,
      categoryName: '',
      image: [],
      parentId: this.parentId,
    };
  }

  public getCategories(): FormArray<FormGroup<SubCategoryFormInterface>> {
    return this.subCategoriesForm.get('categories') as FormArray<
      FormGroup<SubCategoryFormInterface>
    >;
  }

  public newCategory(): FormGroup<SubCategoryFormInterface> {
    return this.fb.group<SubCategoryFormInterface>({
      categoryName: this.fb.nonNullable.control('', [requiredValidator()]),
      image: this.fb.nonNullable.control<File[]>([]),
      parentId: this.fb.control(this.parentId, [requiredValidator()]),
      base64image: this.fb.control(null, [requiredValidator()]),
    });
  }

  public addCategory(): void {
    this.getCategories().push(this.newCategory());
  }

  public initSubCategoriesForm(): void {
    this.subCategoriesForm = this.fb.group<SubCategoriesFormInterface>({
      categories: this.fb.array<FormGroup<SubCategoryFormInterface>>([]),
    });
    this.addCategory();
  }

  public closeDialog(): void {
    this.store.dispatch(PopupActions.closePopup());
    this.store.dispatch(
      CategoryActions.changeCurrentCategoryStatus({
        categoryStatus: { id: null, isEditable: false },
      }),
    );
  }

  public deleteCategory(catIndex: number): void {
    this.getCategories().removeAt(catIndex);
  }

  public addSubCategory(): void {
    const categories: CreateCategoryInterface[] = this.subCategoriesForm
      .getRawValue()
      .categories.map((item) => ({
        categoryName: item.categoryName,
        parentId: item.parentId,
        image: item.base64image,
      }));
    this.store.dispatch(CategoryActions.addCategories({ categories }));
  }

  public setFormValue(index: number, value: CategoryFormDataInterface): void {
    this.getCategories().at(index).setValue(value);
  }
}
