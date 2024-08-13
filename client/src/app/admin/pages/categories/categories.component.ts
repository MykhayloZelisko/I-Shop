import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { Observable } from 'rxjs';
import { selectCategoriesTree } from '../../../+store/categories/selectors/category.selectors';
import { TreeNode } from 'primeng/api';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import {
  TreeModule,
  TreeNodeCollapseEvent,
  TreeNodeExpandEvent,
} from 'primeng/tree';
import { AsyncPipe } from '@angular/common';
import { CategoryItemComponent } from './components/category-item/category-item.component';
import { NewCategoryComponent } from './components/new-category/new-category.component';
import { CategoryActions } from '../../../+store/categories/actions/category.actions';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [TreeModule, AsyncPipe, CategoryItemComponent, NewCategoryComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements OnInit, OnDestroy {
  public categories$!: Observable<TreeNode<CategoryInterface>[]>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.categories$ = this.store.select(selectCategoriesTree);
  }

  public ngOnDestroy(): void {
    this.store.dispatch(CategoryActions.closeNewCategory());
    this.store.dispatch(
      CategoryActions.changeCurrentCategoryStatus({
        categoryStatus: { isEditable: false, id: null },
      }),
    );
  }

  public expandAll(): void {
    this.store.dispatch(CategoryActions.updateCategories({ expanded: true }));
    this.store.dispatch(
      CategoryActions.changeCurrentCategoryStatus({
        categoryStatus: { id: null, isEditable: false },
      }),
    );
    this.store.dispatch(CategoryActions.closeNewCategory());
  }

  public collapseAll(): void {
    this.store.dispatch(CategoryActions.updateCategories({ expanded: false }));
    this.store.dispatch(
      CategoryActions.changeCurrentCategoryStatus({
        categoryStatus: { id: null, isEditable: false },
      }),
    );
    this.store.dispatch(CategoryActions.closeNewCategory());
  }

  public nodeExpand(event: TreeNodeExpandEvent): void {
    this.store.dispatch(
      CategoryActions.updateCategorySuccess({
        category: { ...event.node.data, expanded: true },
      }),
    );
  }

  public nodeCollapse(event: TreeNodeCollapseEvent): void {
    this.store.dispatch(
      CategoryActions.updateCategorySuccess({
        category: { ...event.node.data, expanded: false },
      }),
    );
  }
}
