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
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { requiredValidator } from '../../../../../shared/utils/validators';

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

  public newCategoryCtrl!: FormControl<string>;

  private store = inject(Store<State>);

  private fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.isNewCategory$ = this.store.select(selectNewCategory);
    this.newCategoryCtrl = this.fb.nonNullable.control<string>('', [
      requiredValidator(),
    ]);
  }

  public addCategory(): void {
    this.newCategoryCtrl.setValue('');
    this.store.dispatch(
      CategoryActions.updateCPState({
        payload: {
          currentPropertyId: null,
          isNewCategory: true,
          currentCategory: { id: null, isEditable: false },
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
          image: null,
          level: 1,
        },
      }),
    );
  }

  public cancelAddCategory(): void {
    this.store.dispatch(CategoryActions.clearCPState());
    this.newCategoryCtrl.setValue('');
  }
}
