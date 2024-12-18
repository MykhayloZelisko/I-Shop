import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { AsyncPipe } from '@angular/common';
import { PopupDataInterface } from '../../../shared/models/interfaces/popup-data.interface';
import { LargeCatalogComponent } from './components/large-catalog/large-catalog.component';
import { SmallCatalogComponent } from './components/small-catalog/small-catalog.component';
import { selectCascadeCategories } from '../../../+store/categories/selectors/category.selectors';
import { CascadeCategoryInterface } from '../../../shared/models/interfaces/cascade-category.interface';

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
  public dialog = input.required<PopupDataInterface>();

  public categories$!: Observable<CascadeCategoryInterface[]>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.categories$ = this.store.select(selectCascadeCategories);
  }
}
