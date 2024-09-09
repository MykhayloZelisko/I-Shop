import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { CategoryInterface } from '../../../../../shared/models/interfaces/category.interface';
import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { State } from '../../../../../+store/reducers';
import { Store } from '@ngrx/store';
import { CategoryActions } from '../../../../../+store/categories/actions/category.actions';
import { Observable } from 'rxjs';
import {
  selectCurrentCategory,
  selectHasChildren,
  selectHasProperties,
} from '../../../../../+store/categories/selectors/category.selectors';
import { PopupDataInterface } from '../../../../../shared/models/interfaces/popup-data.interface';
import { PopupTypeEnum } from '../../../../../shared/models/enums/popup-type.enum';
import { SubCategoriesDialogComponent } from './components/sub-categories-dialog/sub-categories-dialog.component';
import { CurrentCategoryStatusInterface } from '../../../../../shared/models/interfaces/current-category-status.interface';
import { ImageConfigInterface } from '../../../../../shared/models/interfaces/image-config.interface';
import { selectPopup } from '../../../../../+store/popup/selectors/popup.selectors';
import { PopupActions } from '../../../../../+store/popup/actions/popup.actions';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CategoryFormInterface } from '../../../../../shared/models/interfaces/sub-categories-form.interface';
import { requiredValidator } from '../../../../../shared/utils/validators';
import { SvgFileControlComponent } from '../../../../../shared/components/svg-file-control/svg-file-control.component';
import { DndFileControlComponent } from '../../../../../shared/components/dnd-file-control/dnd-file-control.component';
import { CPropertiesDialogComponent } from './components/c-properties-dialog/c-properties-dialog.component';

@Component({
  selector: 'app-category-item',
  standalone: true,
  imports: [
    SvgIconComponent,
    AsyncPipe,
    SubCategoriesDialogComponent,
    NgClass,
    NgStyle,
    FormsModule,
    ReactiveFormsModule,
    SvgFileControlComponent,
    DndFileControlComponent,
    CPropertiesDialogComponent,
  ],
  templateUrl: './category-item.component.html',
  styleUrl: './category-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryItemComponent implements OnInit {
  @Input({ required: true }) public category!: CategoryInterface;

  public readonly dialogEnum = PopupTypeEnum;

  public currentCategory$!: Observable<CurrentCategoryStatusInterface>;

  public hasChildren$!: Observable<boolean>;

  public hasProperties$!: Observable<boolean>;

  public dialog$!: Observable<PopupDataInterface>;

  public categoryForm!: FormGroup<CategoryFormInterface>;

  public imageConfig: ImageConfigInterface = {
    width: 0,
    height: 0,
  };

  private store = inject(Store<State>);

  private fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.currentCategory$ = this.store.select(selectCurrentCategory);
    this.dialog$ = this.store.select(selectPopup);
    this.hasChildren$ = this.store.select(selectHasChildren(this.category.id));
    this.hasProperties$ = this.store.select(
      selectHasProperties(this.category.id),
    );
  }

  public initCategoryForm(): void {
    this.categoryForm = this.fb.group<CategoryFormInterface>({
      categoryName: this.fb.nonNullable.control<string>(
        this.category.categoryName,
        [requiredValidator()],
      ),
      image: this.fb.nonNullable.control<string | null>(this.category.image),
      icon: this.fb.control<string | null>(this.category.icon),
      parentId: this.fb.control<string | null>(this.category.parentId),
      level: this.fb.nonNullable.control<number>(this.category.level, [
        requiredValidator(),
      ]),
    });
    if (this.category.parentId) {
      this.categoryForm.controls.image.setValidators(requiredValidator());
      this.categoryForm.controls.parentId.setValidators(requiredValidator());
    } else {
      this.categoryForm.controls.icon.setValidators(requiredValidator());
    }
  }

  public deleteCategory(): void {
    this.store.dispatch(
      CategoryActions.deleteCategory({ id: this.category.id }),
    );
  }

  public editCategory(): void {
    this.initCategoryForm();
    this.store.dispatch(
      CategoryActions.updateCPState({
        payload: {
          currentPropertyId: null,
          isNewCategory: false,
          currentCategory: { id: this.category.id, isEditable: true },
        },
      }),
    );
  }

  public cancelEditCategory(): void {
    this.store.dispatch(CategoryActions.clearCPState());
  }

  public saveCategory(): void {
    const newCategoryData = this.categoryForm.getRawValue();
    this.store.dispatch(
      CategoryActions.updateCategory({
        id: this.category.id,
        category: {
          categoryName: newCategoryData.categoryName,
          image: newCategoryData.image,
          icon: newCategoryData.icon,
        },
      }),
    );
  }

  public openSubCategoriesDialog(): void {
    this.store.dispatch(
      PopupActions.openPopup({
        popup: {
          title: 'Субкатегорії',
          popupType: PopupTypeEnum.SubCategories,
        },
      }),
    );
    this.store.dispatch(
      CategoryActions.updateCPState({
        payload: {
          currentPropertyId: null,
          isNewCategory: false,
          currentCategory: { id: this.category.id, isEditable: false },
        },
      }),
    );
  }

  public getImageStyle(): Record<string, string> {
    return this.imageConfig.height > this.imageConfig.width
      ? {
          height: '100px',
          width: `${(this.imageConfig.width / this.imageConfig.height) * 100}px`,
        }
      : {
          width: '100px',
          height: `${(this.imageConfig.height / this.imageConfig.width) * 100}px`,
        };
  }

  public onImageLoad(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    this.imageConfig.width = imgElement.width;
    this.imageConfig.height = imgElement.height;
  }

  public openPropertiesDialog(): void {
    this.store.dispatch(
      PopupActions.openPopup({
        popup: {
          title: 'Характеристики',
          popupType: PopupTypeEnum.CProperties,
        },
      }),
    );
    this.store.dispatch(
      CategoryActions.updateCPState({
        payload: {
          currentPropertyId: null,
          isNewCategory: false,
          currentCategory: { id: this.category.id, isEditable: false },
        },
      }),
    );
  }
}
