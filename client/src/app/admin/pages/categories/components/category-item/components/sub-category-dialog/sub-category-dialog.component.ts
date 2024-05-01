import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ClickOutsideDirective } from '../../../../../../../shared/directives/click-outside.directive';
import { SvgIconComponent } from 'angular-svg-icon';
import { DialogDataInterface } from '../../../../../../../shared/models/interfaces/dialog-data.interface';
import { Store } from '@ngrx/store';
import { State } from '../../../../../../../+store/reducers';
import { DialogActions } from '../../../../../../../+store/dialog/actions/dialog.actions';
import { DialogTypeEnum } from '../../../../../../../shared/models/enums/dialog-type.enum';
import { CategoryActions } from '../../../../../../../+store/categories/actions/category.actions';
import { CategoryInterface } from '../../../../../../../shared/models/interfaces/category.interface';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { AsyncPipe, NgStyle } from '@angular/common';
import { requiredValidator } from '../../../../../../../shared/utils/validators';
import { DndDirective } from '../../../../../../../shared/directives/dnd.directive';
import {
  SubCategoriesFormInterface,
  SubCategoryFormInterface,
} from '../../../../../../../shared/models/interfaces/sub-categories-form.interface';
import { DndFileControlComponent } from '../../../../../../../shared/components/dnd-file-control/dnd-file-control.component';
import { CreateCategoryInterface } from '../../../../../../../shared/models/interfaces/create-category.interface';

@Component({
  selector: 'app-sub-category-dialog',
  standalone: true,
  imports: [
    ClickOutsideDirective,
    SvgIconComponent,
    ReactiveFormsModule,
    AsyncPipe,
    NgStyle,
    DndDirective,
    DndFileControlComponent,
  ],
  templateUrl: './sub-category-dialog.component.html',
  styleUrl: './sub-category-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubCategoryDialogComponent implements OnInit {
  @Input({ required: true }) public dialog!: DialogDataInterface;

  @Input({ required: true }) public category!: CategoryInterface;

  @ViewChildren('fileUpload') public fileUploads!: QueryList<
    ElementRef<HTMLInputElement>
  >;

  public subCategoriesForm!: FormGroup<SubCategoriesFormInterface>;

  private store = inject(Store<State>);

  private fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.initSubCategoriesForm();
  }

  public getCategories(): FormArray<FormGroup<SubCategoryFormInterface>> {
    return this.subCategoriesForm.get('categories') as FormArray<
      FormGroup<SubCategoryFormInterface>
    >;
  }

  public newCategory(): FormGroup {
    return this.fb.group({
      categoryName: ['', [requiredValidator()]],
      image: [null, []],
      parentId: [this.category.id],
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
    this.store.dispatch(
      DialogActions.openDialog({
        dialog: {
          title: '',
          dialogType: DialogTypeEnum.None,
        },
      }),
    );
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
        image: item.image[0],
      }));
    this.store.dispatch(CategoryActions.addCategories({ categories }));
  }

  public handleInput(event: KeyboardEvent): void {
    event.stopPropagation();
  }
}
