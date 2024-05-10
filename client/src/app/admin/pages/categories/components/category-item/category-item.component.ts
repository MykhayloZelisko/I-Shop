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
import { selectCurrentCategory } from '../../../../../+store/categories/selectors/category.selectors';
import { DialogDataInterface } from '../../../../../shared/models/interfaces/dialog-data.interface';
import { selectDialog } from '../../../../../+store/dialog/selectors/dialog.selectors';
import { DialogTypeEnum } from '../../../../../shared/models/enums/dialog-type.enum';
import { SubCategoryDialogComponent } from './components/sub-category-dialog/sub-category-dialog.component';
import { DialogActions } from '../../../../../+store/dialog/actions/dialog.actions';
import { CurrentCategoryStatusInterface } from '../../../../../shared/models/interfaces/current-category-status.interface';
import { EditCategoryItemComponent } from '../../../../../shared/components/edit-category-item/edit-category-item.component';
import { CategoryFormDataInterface } from '../../../../../shared/models/interfaces/category-form-data.interface';
import { ImageConfigInterface } from '../../../../../shared/models/interfaces/image-config.interface';

@Component({
  selector: 'app-category-item',
  standalone: true,
  imports: [
    SvgIconComponent,
    AsyncPipe,
    SubCategoryDialogComponent,
    EditCategoryItemComponent,
    NgClass,
    NgStyle,
  ],
  templateUrl: './category-item.component.html',
  styleUrl: './category-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryItemComponent implements OnInit {
  @Input({ required: true }) public category!: CategoryInterface;

  public readonly dialogEnum = DialogTypeEnum;

  public currentCategory$!: Observable<CurrentCategoryStatusInterface>;

  public dialog$!: Observable<DialogDataInterface>;

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
    this.dialog$ = this.store.select(selectDialog);
  }

  public deleteCategory(): void {
    this.store.dispatch(
      CategoryActions.deleteCategory({ id: this.category.id }),
    );
  }

  public editCategory(): void {
    this.store.dispatch(
      CategoryActions.changeCurrentCategoryStatus({
        categoryStatus: { id: this.category.id, isEditable: true },
      }),
    );
    this.store.dispatch(CategoryActions.closeNewCategory());
    this.categoryData = {
      parentId: this.category.parentId,
      categoryName: this.category.categoryName,
      image: [],
      base64image: this.category.image,
    };
  }

  public cancelEditCategory(): void {
    this.store.dispatch(
      CategoryActions.changeCurrentCategoryStatus({
        categoryStatus: { id: null, isEditable: false },
      }),
    );
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

  public openSubCategoryDialog(): void {
    this.store.dispatch(
      DialogActions.openDialog({
        dialog: {
          title: 'Субкатегорії',
          dialogType: DialogTypeEnum.SubCategory,
        },
      }),
    );
    this.store.dispatch(
      CategoryActions.changeCurrentCategoryStatus({
        categoryStatus: { id: this.category.id, isEditable: false },
      }),
    );
    this.store.dispatch(CategoryActions.closeNewCategory());
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
}
