import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
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
import { PaginatorModule } from 'primeng/paginator';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { requiredValidator } from '../../../../../../../shared/utils/validators';

@Component({
  selector: 'app-sub-category-dialog',
  standalone: true,
  imports: [
    ClickOutsideDirective,
    SvgIconComponent,
    PaginatorModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './sub-category-dialog.component.html',
  styleUrl: './sub-category-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubCategoryDialogComponent implements OnInit {
  @Input({ required: true }) public dialog!: DialogDataInterface;

  @Input({ required: true }) public category!: CategoryInterface;

  public subCategoriesForm!: FormGroup;

  private store = inject(Store<State>);

  private fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.initSubCategoriesForm();
  }

  public getCategories(): FormArray {
    return this.subCategoriesForm.get('categories') as FormArray;
  }

  public newCategory(): FormGroup {
    return this.fb.group({
      subCategoryName: ['', [requiredValidator()]],
    });
  }

  public addCategory(): void {
    this.getCategories().push(this.newCategory());
  }

  public initSubCategoriesForm(): void {
    this.subCategoriesForm = this.fb.group({
      categories: this.fb.array([]),
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
    const categories = this.subCategoriesForm
      .getRawValue()
      .categories.map((item: { subCategoryName: string }) => ({
        categoryName: item.subCategoryName,
        parentId: this.category.id,
      }));
    this.store.dispatch(CategoryActions.addCategories({ categories }));
  }

  public handleInput(event: KeyboardEvent): void {
    event.stopPropagation();
  }
}
