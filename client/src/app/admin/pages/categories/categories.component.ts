import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { Observable, take } from 'rxjs';
import { selectCGPTree } from '../../../+store/shared/selectors/shared.selectors';
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
import { CPropertiesGroupItemComponent } from './components/c-properties-group-item/c-properties-group-item.component';
import { CPropertyItemComponent } from './components/c-property-item/c-property-item.component';
import { SharedActions } from '../../../+store/shared/actions/shared.actions';
import { selectIdsCPropertiesGroups } from '../../../+store/c-properties-groups/selectors/c-properties-group.selectors';
import { CPropertiesGroupActions } from '../../../+store/c-properties-groups/actions/c-properties-group.actions';
import { selectIdsCProperties } from '../../../+store/c-properties/selectors/c-property.selectors';
import { CPropertyActions } from '../../../+store/c-properties/actions/c-property.actions';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    TreeModule,
    AsyncPipe,
    CategoryItemComponent,
    NewCategoryComponent,
    CPropertiesGroupItemComponent,
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
    this.categories$ = this.store.select(selectCGPTree);
  }

  public ngOnDestroy(): void {
    this.store.dispatch(SharedActions.clearCGPState());
  }

  public expandAll(): void {
    this.store.dispatch(
      CategoryActions.updateCategories({ expanded: true, loadedGroups: true }),
    );
    this.store
      .select(selectIdsCPropertiesGroups)
      .pipe(take(1))
      .subscribe((ids) => {
        this.store.dispatch(
          CPropertiesGroupActions.addFilteredGroups({ ids: ids as string[] }),
        );
      });
    this.store
      .select(selectIdsCProperties)
      .pipe(take(1))
      .subscribe((ids) => {
        this.store.dispatch(
          CPropertyActions.addFilteredProperties({ ids: ids as string[] }),
        );
      });
    this.store.dispatch(SharedActions.clearCGPState());
  }

  public collapseAll(): void {
    this.store.dispatch(CategoryActions.updateCategories({ expanded: false }));
    this.store.dispatch(
      CPropertiesGroupActions.updateCPropertiesGroups({ expanded: false }),
    );
    this.store.dispatch(SharedActions.clearCGPState());
  }

  public nodeExpand(event: TreeNodeExpandEvent): void {
    if (event.node.type === 'category') {
      if (event.node.data.hasGroups && !event.node.data.loadedGroups) {
        this.store.dispatch(
          CPropertiesGroupActions.addCPGroupsByCategoryId({
            category: event.node.data,
          }),
        );
      } else {
        this.store.dispatch(
          CategoryActions.updateCategorySuccess({
            category: { ...event.node.data, expanded: true },
          }),
        );
      }
    }
    if (event.node.type === 'group') {
      if (event.node.data.hasProperties && !event.node.data.loadedProperties) {
        this.store.dispatch(
          CPropertyActions.addCPropertiesByGroupId({
            group: event.node.data,
          }),
        );
      }
    }
    this.store.dispatch(SharedActions.clearCGPState());
  }

  public nodeCollapse(event: TreeNodeCollapseEvent): void {
    if (event.node.type === 'category') {
      this.store.dispatch(
        CategoryActions.updateCategorySuccess({
          category: { ...event.node.data, expanded: false },
        }),
      );
    }
    if (event.node.type === 'group') {
      this.store.dispatch(
        CPropertiesGroupActions.updateCPropertiesGroupSuccess({
          group: { ...event.node.data, expanded: false },
        }),
      );
    }
    this.store.dispatch(SharedActions.clearCGPState());
  }
}
