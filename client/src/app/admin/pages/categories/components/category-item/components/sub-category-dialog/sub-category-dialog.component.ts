import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
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
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-sub-category-dialog',
  standalone: true,
  imports: [
    ClickOutsideDirective,
    SvgIconComponent,
    PaginatorModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sub-category-dialog.component.html',
  styleUrl: './sub-category-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubCategoryDialogComponent {
  @Input({ required: true }) public dialog!: DialogDataInterface;

  @Input({ required: true }) public category!: CategoryInterface;

  public subCategoryCtrl: FormControl = new FormControl();

  private store = inject(Store<State>);

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
        categoryStatus: {
          id: null,
          isEditable: false,
        },
      }),
    );
  }

  public addSubCategory(): void {
    this.store.dispatch(
      CategoryActions.addCategory({
        category: {
          parentId: this.category.id,
          categoryName: this.subCategoryCtrl.getRawValue(),
        },
      }),
    );
  }

  public handleInput(event: KeyboardEvent): void {
    event.stopPropagation();
  }
}
