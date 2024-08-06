import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { TreeNode } from 'primeng/api';
import { CategoryInterface } from '../../../../../shared/models/interfaces/category.interface';
import { PopupDataInterface } from '../../../../../shared/models/interfaces/popup-data.interface';
import { SvgIconComponent } from 'angular-svg-icon';
import { PopupActions } from '../../../../../+store/popup/actions/popup.actions';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { PopupTypeEnum } from '../../../../../shared/models/enums/popup-type.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-small-catalog',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './small-catalog.component.html',
  styleUrl: './small-catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmallCatalogComponent {
  @Input({ required: true }) public categories!: TreeNode<CategoryInterface>[];

  @Input({ required: true }) public dialog!: PopupDataInterface;

  public isCoreList = true;

  public currentCategory!: TreeNode<CategoryInterface>;

  private router = inject(Router);

  private store = inject(Store<State>);

  public showSubCategories(category: TreeNode<CategoryInterface>): void {
    this.isCoreList = false;
    this.currentCategory = category;
    this.store.dispatch(
      PopupActions.openPopup({
        popup: {
          title: category.data ? category.data.categoryName : '',
          popupType: PopupTypeEnum.Catalog,
        },
      }),
    );
  }

  public goBack(): void {
    this.isCoreList = true;
    this.store.dispatch(
      PopupActions.openPopup({
        popup: {
          title: 'Каталог',
          popupType: PopupTypeEnum.Catalog,
        },
      }),
    );
  }

  public closeCatalog(): void {
    this.store.dispatch(PopupActions.closePopup());
  }

  public changeCategory(event: MouseEvent, id: string | undefined): void {
    event.preventDefault();
    if (id) {
      this.router.navigate(['categories', `${id}`]);
    } else {
      this.router.navigate(['categories']);
    }
    this.store.dispatch(PopupActions.closePopup());
  }
}
