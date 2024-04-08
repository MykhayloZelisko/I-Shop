import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { map, Observable } from 'rxjs';
import { selectCategoriesTree } from '../../../+store/categories/selectors/category.selectors';
import { TreeNode } from 'primeng/api';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import { TreeModule } from 'primeng/tree';
import { AsyncPipe } from '@angular/common';
import { CategoryItemComponent } from './components/category-item/category-item.component';
import { NewCategoryComponent } from './components/new-category/new-category.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [TreeModule, AsyncPipe, CategoryItemComponent, NewCategoryComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements OnInit {
  public categories$!: Observable<TreeNode<CategoryInterface>[]>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.categories$ = this.store.select(selectCategoriesTree);
  }

  public expandAll(): void {
    this.categories$ = this.categories$.pipe(
      map((nodes) => {
        return nodes.map((node) => {
          this.expandRecursive(node, true);
          return node;
        });
      }),
    );
  }

  public collapseAll(): void {
    this.categories$ = this.categories$.pipe(
      map((nodes) => {
        return nodes.map((node) => {
          this.expandRecursive(node, false);
          return node;
        });
      }),
    );
  }

  private expandRecursive(node: TreeNode, isExpand: boolean): void {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }
}
