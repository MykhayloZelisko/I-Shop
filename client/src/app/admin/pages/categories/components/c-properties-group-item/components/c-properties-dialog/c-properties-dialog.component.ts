import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { PopupDataInterface } from '../../../../../../../shared/models/interfaces/popup-data.interface';
import { ClickOutsideDirective } from '../../../../../../../shared/directives/click-outside.directive';
import { PopupActions } from '../../../../../../../+store/popup/actions/popup.actions';
import { Store } from '@ngrx/store';
import { State } from '../../../../../../../+store/reducers';
import { SvgIconComponent } from 'angular-svg-icon';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  CPropertiesFormInterface,
  CPropertyFormInterface,
} from '../../../../../../../shared/models/interfaces/c-properties-form.interface';
import { requiredValidator } from '../../../../../../../shared/utils/validators';
import { CreateCPropertyInterface } from '../../../../../../../shared/models/interfaces/create-c-property.interface';
import { SharedActions } from '../../../../../../../+store/shared/actions/shared.actions';
import { CPropertyActions } from '../../../../../../../+store/c-properties/actions/c-property.actions';
import { CPropertiesGroupInterface } from '../../../../../../../shared/models/interfaces/c-properties-group.interface';

@Component({
  selector: 'app-c-properties-dialog',
  standalone: true,
  imports: [ClickOutsideDirective, SvgIconComponent, ReactiveFormsModule],
  templateUrl: './c-properties-dialog.component.html',
  styleUrl: './c-properties-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CPropertiesDialogComponent implements OnInit {
  public dialog = input.required<PopupDataInterface>();

  public group = input.required<CPropertiesGroupInterface>();

  public cPropertiesForm!: FormGroup<CPropertiesFormInterface>;

  private store = inject(Store<State>);

  private fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.initCPropertiesForm();
  }

  public initCPropertiesForm(): void {
    this.cPropertiesForm = this.fb.group<CPropertiesFormInterface>({
      properties: this.fb.array<FormGroup<CPropertyFormInterface>>([]),
    });
    this.addProperty();
  }

  public addProperty(): void {
    this.getProperties().push(this.newProperty());
  }

  public getProperties(): FormArray<FormGroup<CPropertyFormInterface>> {
    return this.cPropertiesForm.get('properties') as FormArray<
      FormGroup<CPropertyFormInterface>
    >;
  }

  public newProperty(): FormGroup<CPropertyFormInterface> {
    return this.fb.group<CPropertyFormInterface>({
      propertyName: this.fb.nonNullable.control<string>('', [
        requiredValidator(),
      ]),
      groupId: this.fb.nonNullable.control<string>(this.group().id, [
        requiredValidator(),
      ]),
    });
  }

  public closeDialog(): void {
    this.store.dispatch(PopupActions.closePopup());
    this.store.dispatch(SharedActions.clearCGPState());
  }

  public deleteProperty(propIndex: number): void {
    this.getProperties().removeAt(propIndex);
  }

  public saveProperties(): void {
    const properties: CreateCPropertyInterface[] =
      this.cPropertiesForm.getRawValue().properties;
    this.store.dispatch(
      CPropertyActions.addCProperties({ group: this.group(), properties }),
    );
  }
}
