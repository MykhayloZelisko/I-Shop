import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { map, Observable, tap } from 'rxjs';
import { CategoryInterface } from '../../../shared/models/interfaces/category.interface';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { AsyncPipe, NgClass } from '@angular/common';
import { selectCategoriesTree } from '../../../+store/categories/selectors/category.selectors';
import { TreeNode } from 'primeng/api';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [ClickOutsideDirective, AsyncPipe, NgClass, SvgIconComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogComponent implements OnInit {
  public categories$!: Observable<TreeNode<CategoryInterface>[]>;

  public currentCategory!: TreeNode<CategoryInterface>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.categories$ = this.store.select(selectCategoriesTree).pipe(
      map((categories: TreeNode<CategoryInterface>[]) =>
        categories.slice(0, -1),
      ),
      tap((categories: TreeNode<CategoryInterface>[]) => {
        this.currentCategory = categories[0];
      }),
    );
  }

  public onHover(category: TreeNode<CategoryInterface>): void {
    this.currentCategory = category;
  }
}
