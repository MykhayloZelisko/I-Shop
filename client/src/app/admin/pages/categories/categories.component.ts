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
import { selectCategoriesWithPropertiesTree } from '../../../+store/categories/selectors/category.selectors';
import { TreeNode } from 'primeng/api';
import {
  TreeModule,
  TreeNodeCollapseEvent,
  TreeNodeExpandEvent,
} from 'primeng/tree';
import { AsyncPipe } from '@angular/common';
import { CategoryItemComponent } from './components/category-item/category-item.component';
import { NewCategoryComponent } from './components/new-category/new-category.component';
import { CategoryActions } from '../../../+store/categories/actions/category.actions';
import { TreeNodeDataType } from '../../../shared/models/types/tree-node-data.type';
import { CPropertyItemComponent } from './components/c-property-item/c-property-item.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    TreeModule,
    AsyncPipe,
    CategoryItemComponent,
    NewCategoryComponent,
    CPropertyItemComponent,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements OnInit, OnDestroy {
  public categories$!: Observable<TreeNode<TreeNodeDataType>[]>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.categories$ = this.store.select(selectCategoriesWithPropertiesTree);
  }

  public ngOnDestroy(): void {
    this.store.dispatch(CategoryActions.clearCPState());
  }

  public expandAll(): void {
    this.store.dispatch(CategoryActions.updateCategories({ expanded: true }));
    this.store.dispatch(CategoryActions.clearCPState());
  }

  public collapseAll(): void {
    this.store.dispatch(CategoryActions.updateCategories({ expanded: false }));
    this.store.dispatch(CategoryActions.clearCPState());
  }

  public nodeExpand(event: TreeNodeExpandEvent): void {
    this.store.dispatch(
      CategoryActions.updateCategorySuccess({
        category: { ...event.node.data, expanded: true },
      }),
    );
    this.store.dispatch(CategoryActions.clearCPState());
  }

  public nodeCollapse(event: TreeNodeCollapseEvent): void {
    this.store.dispatch(
      CategoryActions.updateCategorySuccess({
        category: { ...event.node.data, expanded: false },
      }),
    );
    this.store.dispatch(CategoryActions.clearCPState());
  }
}
