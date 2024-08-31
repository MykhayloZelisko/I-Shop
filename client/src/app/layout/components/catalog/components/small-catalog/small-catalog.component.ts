import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { PopupDataInterface } from '../../../../../shared/models/interfaces/popup-data.interface';
import { SvgIconComponent } from 'angular-svg-icon';
import { PopupActions } from '../../../../../+store/popup/actions/popup.actions';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { PopupTypeEnum } from '../../../../../shared/models/enums/popup-type.enum';
import { Router } from '@angular/router';
import { CascadeCategoryInterface } from '../../../../../shared/models/interfaces/cascade-category.interface';

@Component({
  selector: 'app-small-catalog',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './small-catalog.component.html',
  styleUrl: './small-catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmallCatalogComponent {
  @Input({ required: true }) public categories!: CascadeCategoryInterface[];

  @Input({ required: true }) public dialog!: PopupDataInterface;

  public isCoreList = true;

  public currentCategory!: CascadeCategoryInterface;

  private router = inject(Router);

  private store = inject(Store<State>);

  public showSubCategories(category: CascadeCategoryInterface): void {
    this.isCoreList = false;
    this.currentCategory = category;
    this.store.dispatch(
      PopupActions.openPopup({
        popup: {
          title: category.categoryName,
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
