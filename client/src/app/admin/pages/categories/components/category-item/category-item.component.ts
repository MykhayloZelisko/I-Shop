import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CategoryInterface } from '../../../../../shared/models/interfaces/category.interface';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { State } from '../../../../../+store/reducers';
import { Store } from '@ngrx/store';
import { CategoryActions } from '../../../../../+store/categories/actions/category.actions';
import { Observable } from 'rxjs';
import { selectCurrentCategoryId } from '../../../../../+store/categories/selectors/category.selectors';

@Component({
  selector: 'app-category-item',
  standalone: true,
  imports: [SvgIconComponent, AsyncPipe, NgTemplateOutlet],
  templateUrl: './category-item.component.html',
  styleUrl: './category-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryItemComponent implements OnInit {
  @Input({ required: true }) public category!: CategoryInterface;

  @ViewChild('categoryItem')
  public categoryItem!: ElementRef;

  public currentCategoryId$!: Observable<string | null>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.currentCategoryId$ = this.store.select(selectCurrentCategoryId);
  }

  public deleteCategory(): void {
    this.store.dispatch(
      CategoryActions.deleteCategory({ id: this.category.id }),
    );
  }

  public editCategory(): void {
    this.store.dispatch(
      CategoryActions.setCurrentCategoryId({
        categoryId: this.category.id,
      }),
    );
    this.store.dispatch(CategoryActions.closeNewCategory());
  }

  public cancelEditCategory(): void {
    this.store.dispatch(CategoryActions.clearCurrentCategoryId());
  }

  public saveCategory(): void {
    const newCategoryName = this.categoryItem.nativeElement.innerHTML.trim();
    this.store.dispatch(
      CategoryActions.updateCategory({
        id: this.category.id,
        categoryName: newCategoryName,
      }),
    );
  }

  public addSubCategory(): void {
    // TODO
  }
}
