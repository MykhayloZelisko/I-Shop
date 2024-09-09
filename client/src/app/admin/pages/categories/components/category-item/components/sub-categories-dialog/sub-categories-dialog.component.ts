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
  CategoryFormInterface,
} from '../../../../../../../shared/models/interfaces/sub-categories-form.interface';
import { CreateCategoryInterface } from '../../../../../../../shared/models/interfaces/create-category.interface';
import { PopupActions } from '../../../../../../../+store/popup/actions/popup.actions';
import { DndFileControlComponent } from '../../../../../../../shared/components/dnd-file-control/dnd-file-control.component';

@Component({
  selector: 'app-sub-categories-dialog',
  standalone: true,
  imports: [
    ClickOutsideDirective,
    SvgIconComponent,
    ReactiveFormsModule,
    DndFileControlComponent,
  ],
  templateUrl: './sub-categories-dialog.component.html',
  styleUrl: './sub-categories-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubCategoriesDialogComponent implements OnInit {
  @Input({ required: true }) public dialog!: PopupDataInterface;

  @Input({ required: true }) public parentId!: string;

  @Input({ required: true }) public level!: number;

  public subCategoriesForm!: FormGroup<SubCategoriesFormInterface>;

  private store = inject(Store<State>);

  private fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.initSubCategoriesForm();
  }

  public getCategories(): FormArray<FormGroup<CategoryFormInterface>> {
    return this.subCategoriesForm.get('categories') as FormArray<
      FormGroup<CategoryFormInterface>
    >;
  }

  public newCategory(): FormGroup<CategoryFormInterface> {
    return this.fb.group<CategoryFormInterface>({
      categoryName: this.fb.nonNullable.control<string>('', [
        requiredValidator(),
      ]),
      image: this.fb.control<string | null>(null, [requiredValidator()]),
      icon: this.fb.control<string | null>(null),
      parentId: this.fb.control<string | null>(this.parentId, [
        requiredValidator(),
      ]),
      level: this.fb.nonNullable.control<number>(this.level, [
        requiredValidator(),
      ]),
    });
  }

  public addCategory(): void {
    this.getCategories().push(this.newCategory());
  }

  public initSubCategoriesForm(): void {
    this.subCategoriesForm = this.fb.group<SubCategoriesFormInterface>({
      categories: this.fb.array<FormGroup<CategoryFormInterface>>([]),
    });
    this.addCategory();
  }

  public closeDialog(): void {
    this.store.dispatch(PopupActions.closePopup());
    this.store.dispatch(CategoryActions.clearCPState());
  }

  public deleteCategory(catIndex: number): void {
    this.getCategories().removeAt(catIndex);
  }

  public saveSubCategories(): void {
    const categories: CreateCategoryInterface[] =
      this.subCategoriesForm.getRawValue().categories;
    this.store.dispatch(CategoryActions.addCategories({ categories }));
  }
}
