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
import { EditCategoryItemComponent } from '../../../../../shared/components/edit-category-item/edit-category-item.component';
import { CategoryFormDataInterface } from '../../../../../shared/models/interfaces/category-form-data.interface';
import { ImageConfigInterface } from '../../../../../shared/models/interfaces/image-config.interface';
import { selectPopup } from '../../../../../+store/popup/selectors/popup.selectors';
import { PopupActions } from '../../../../../+store/popup/actions/popup.actions';
import { CPropertiesDialogComponent } from './components/c-properties-dialog/c-properties-dialog.component';

@Component({
  selector: 'app-category-item',
  standalone: true,
  imports: [
    SvgIconComponent,
    AsyncPipe,
    SubCategoriesDialogComponent,
    EditCategoryItemComponent,
    NgClass,
    NgStyle,
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

  public newCategoryData!: CategoryFormDataInterface;

  public categoryData!: CategoryFormDataInterface;

  public imageConfig: ImageConfigInterface = {
    width: 0,
    height: 0,
  };

  public isDisabled = true;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.currentCategory$ = this.store.select(selectCurrentCategory);
    this.dialog$ = this.store.select(selectPopup);
    this.hasChildren$ = this.store.select(selectHasChildren(this.category.id));
    this.hasProperties$ = this.store.select(
      selectHasProperties(this.category.id),
    );
  }

  public deleteCategory(): void {
    this.store.dispatch(
      CategoryActions.deleteCategory({ id: this.category.id }),
    );
  }

  public editCategory(): void {
    this.store.dispatch(
      CategoryActions.updateCPState({
        payload: {
          currentPropertyId: null,
          isNewCategory: false,
          currentCategory: { id: this.category.id, isEditable: true },
        },
      }),
    );
    this.categoryData = {
      parentId: this.category.parentId,
      categoryName: this.category.categoryName,
      image: [],
      base64image: this.category.image,
    };
  }

  public cancelEditCategory(): void {
    this.store.dispatch(CategoryActions.clearCPState());
  }

  public saveCategory(): void {
    this.store.dispatch(
      CategoryActions.updateCategory({
        id: this.category.id,
        category: {
          categoryName: this.newCategoryData.categoryName,
          image: this.newCategoryData.base64image,
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

  public changeCategoryData(categoryData: CategoryFormDataInterface): void {
    this.newCategoryData = categoryData;
    this.isDisabled = !categoryData.categoryName.trim();
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
