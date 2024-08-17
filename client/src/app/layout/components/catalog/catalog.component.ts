import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { Observable } from 'rxjs';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { AsyncPipe } from '@angular/common';
import { selectCategoriesTree } from '../../../+store/categories/selectors/category.selectors';
import { TreeNode } from 'primeng/api';
import { PopupDataInterface } from '../../../shared/models/interfaces/popup-data.interface';
import { LargeCatalogComponent } from './components/large-catalog/large-catalog.component';
import { SmallCatalogComponent } from './components/small-catalog/small-catalog.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    AsyncPipe,
    ClickOutsideDirective,
    LargeCatalogComponent,
    SmallCatalogComponent,
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogComponent implements OnInit {
  @Input({ required: true }) public dialog!: PopupDataInterface;

  public categories$!: Observable<TreeNode<CategoryInterface>[]>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.categories$ = this.store.select(selectCategoriesTree);
  }
}
