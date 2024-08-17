import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { Observable } from 'rxjs';
import { selectCurrentPropertyId } from '../../../../../+store/categories/selectors/category.selectors';
import { AsyncPipe } from '@angular/common';
import { CPropertyInterface } from '../../../../../shared/models/interfaces/c-property.interface';
import { SvgIconComponent } from 'angular-svg-icon';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { requiredValidator } from '../../../../../shared/utils/validators';
import { CategoryActions } from '../../../../../+store/categories/actions/category.actions';

@Component({
  selector: 'app-c-property-item',
  standalone: true,
  imports: [AsyncPipe, SvgIconComponent, ReactiveFormsModule],
  templateUrl: './c-property-item.component.html',
  styleUrl: './c-property-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CPropertyItemComponent implements OnInit {
  @Input({ required: true }) public property!: CPropertyInterface;

  public currentPropertyId$!: Observable<string | null>;

  public propertyCtrl!: FormControl<string>;

  private store = inject(Store<State>);

  private fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.currentPropertyId$ = this.store.select(selectCurrentPropertyId);
    this.propertyCtrl = this.fb.nonNullable.control<string>(
      this.property.propertyName,
      [requiredValidator()],
    );
  }

  public handleInput(event: KeyboardEvent): void {
    event.stopPropagation();
  }

  public editProperty(): void {
    this.store.dispatch(
      CategoryActions.changeCurrentPropertyId({ id: this.property.id }),
    );
    this.store.dispatch(CategoryActions.closeNewCategory());
    this.store.dispatch(
      CategoryActions.changeCurrentCategoryStatus({
        categoryStatus: { id: null, isEditable: false },
      }),
    );
  }

  public saveProperty(): void {
    const propertyName = this.propertyCtrl.getRawValue();
    this.store.dispatch(
      CategoryActions.updateCProperty({ id: this.property.id, propertyName }),
    );
  }

  public cancelEditProperty(): void {
    this.store.dispatch(CategoryActions.changeCurrentPropertyId({ id: null }));
    this.propertyCtrl.setValue(this.property.propertyName);
  }
}
