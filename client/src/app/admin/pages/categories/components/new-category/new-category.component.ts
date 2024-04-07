import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { CategoryActions } from '../../../../../+store/categories/actions/category.actions';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { Observable } from 'rxjs';
import { selectNewCategory } from '../../../../../+store/categories/selectors/category.selectors';
import { AsyncPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-category',
  standalone: true,
  imports: [SvgIconComponent, AsyncPipe, ReactiveFormsModule],
  templateUrl: './new-category.component.html',
  styleUrl: './new-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCategoryComponent implements OnInit {
  public isNewCategory$!: Observable<boolean>;

  public newCategoryCtrl: FormControl = new FormControl('');

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.isNewCategory$ = this.store.select(selectNewCategory);
  }

  public addCategory(): void {
    this.store.dispatch(CategoryActions.openNewCategory());
    this.store.dispatch(
      CategoryActions.changeCurrentCategoryStatus({
        categoryStatus: {
          id: null,
          isEditable: false,
        },
      }),
    );
  }

  public saveCategory(): void {
    this.store.dispatch(
      CategoryActions.addCategory({
        category: {
          categoryName: this.newCategoryCtrl.getRawValue(),
          parentId: null,
          level: 1,
        },
      }),
    );
  }

  public cancelAddCategory(): void {
    this.store.dispatch(CategoryActions.closeNewCategory());
  }
}
