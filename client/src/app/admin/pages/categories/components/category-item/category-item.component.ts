import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CategoryInterface } from '../../../../../shared/models/interfaces/category.interface';
import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
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

@Component({
  selector: 'app-category-item',
  standalone: true,
  imports: [
    SvgIconComponent,
    AsyncPipe,
    NgTemplateOutlet,
    SubCategoryDialogComponent,
    NgClass,
  ],
  templateUrl: './category-item.component.html',
  styleUrl: './category-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryItemComponent implements OnInit {
  @Input({ required: true }) public category!: CategoryInterface;

  @ViewChild('categoryItem')
  public categoryItem!: ElementRef;

  public readonly dialogEnum = DialogTypeEnum;

  public currentCategory$!: Observable<CurrentCategoryStatusInterface>;

  public dialog$!: Observable<DialogDataInterface>;

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
  }

  public cancelEditCategory(): void {
    this.store.dispatch(
      CategoryActions.changeCurrentCategoryStatus({
        categoryStatus: { id: null, isEditable: false },
      }),
    );
  }

  public saveCategory(): void {
    const newCategoryName = this.categoryItem.nativeElement.innerHTML.trim();
    this.store.dispatch(
      CategoryActions.updateCategory({
        id: this.category.id,
        categoryName: newCategoryName,
      }),
    );
  }

  public addSubCategory(): void {
    this.store.dispatch(
      DialogActions.openDialog({
        dialog: {
          title: 'Субкатегорія',
          dialogType: DialogTypeEnum.SubCategory,
        },
      }),
    );
    this.store.dispatch(
      CategoryActions.changeCurrentCategoryStatus({
        categoryStatus: { id: this.category.id, isEditable: false },
      }),
    );
  }
}
