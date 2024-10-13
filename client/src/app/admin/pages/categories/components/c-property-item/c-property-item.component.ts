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
import { selectCurrentPropertyId } from '../../../../../+store/c-properties/selectors/c-property.selectors';
import { AsyncPipe } from '@angular/common';
import { CPropertyInterface } from '../../../../../shared/models/interfaces/c-property.interface';
import { SvgIconComponent } from 'angular-svg-icon';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { requiredValidator } from '../../../../../shared/utils/validators';
import { SharedActions } from '../../../../../+store/shared/actions/shared.actions';
import { CPropertyActions } from '../../../../../+store/c-properties/actions/c-property.actions';

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

  public editProperty(): void {
    this.store.dispatch(
      SharedActions.updateCGPState({
        payload: {
          currentPropertyId: this.property.id,
          isNewCategory: false,
          currentCategory: { id: null, isEditable: false },
          currentGroup: { id: null, isEditable: false },
        },
      }),
    );
  }

  public saveProperty(): void {
    const propertyName = this.propertyCtrl.getRawValue();
    this.store.dispatch(
      CPropertyActions.updateCProperty({ id: this.property.id, propertyName }),
    );
  }

  public cancelEditProperty(): void {
    this.store.dispatch(SharedActions.clearCGPState());
    this.propertyCtrl.setValue(this.property.propertyName);
  }

  public deleteProperty(): void {
    this.store.dispatch(
      CPropertyActions.deleteCProperty({ id: this.property.id }),
    );
  }
}
