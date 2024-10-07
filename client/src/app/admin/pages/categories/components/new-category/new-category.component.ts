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
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { requiredValidator } from '../../../../../shared/utils/validators';
import { SvgFileControlComponent } from '../../../../../shared/components/svg-file-control/svg-file-control.component';
import { NewCategoryFormInterface } from '../../../../../shared/models/interfaces/new-category-form.interface';

@Component({
  selector: 'app-new-category',
  standalone: true,
  imports: [
    SvgIconComponent,
    AsyncPipe,
    ReactiveFormsModule,
    SvgFileControlComponent,
  ],
  templateUrl: './new-category.component.html',
  styleUrl: './new-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCategoryComponent implements OnInit {
  public isNewCategory$!: Observable<boolean>;

  public newCategoryForm!: FormGroup<NewCategoryFormInterface>;

  private store = inject(Store<State>);

  private fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.isNewCategory$ = this.store.select(selectNewCategory);
    this.initNewCategoryForm();
  }

  public initNewCategoryForm(): void {
    this.newCategoryForm = this.fb.group<NewCategoryFormInterface>({
      categoryName: this.fb.nonNullable.control<string>('', [
        requiredValidator(),
      ]),
      icon: this.fb.nonNullable.control<string>('', [requiredValidator()]),
    });
  }

  public addCategory(): void {
    this.newCategoryForm.reset();
    this.store.dispatch(
      CategoryActions.updateCGPState({
        payload: {
          currentPropertyId: null,
          isNewCategory: true,
          currentCategory: { id: null, isEditable: false },
          currentGroup: { id: null, isEditable: false },
        },
      }),
    );
  }

  public saveCategory(): void {
    const categoryData = this.newCategoryForm.getRawValue();
    this.store.dispatch(
      CategoryActions.addCategory({
        category: {
          ...categoryData,
          parentId: null,
          image: null,
          level: 1,
        },
      }),
    );
  }

  public cancelAddCategory(): void {
    this.store.dispatch(CategoryActions.clearCGPState());
  }
}
