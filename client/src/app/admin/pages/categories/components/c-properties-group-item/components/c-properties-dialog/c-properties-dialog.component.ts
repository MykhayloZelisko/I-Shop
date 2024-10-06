import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { PopupDataInterface } from '../../../../../../../shared/models/interfaces/popup-data.interface';
import { ClickOutsideDirective } from '../../../../../../../shared/directives/click-outside.directive';
import { PopupActions } from '../../../../../../../+store/popup/actions/popup.actions';
import { CategoryActions } from '../../../../../../../+store/categories/actions/category.actions';
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

@Component({
  selector: 'app-c-properties-dialog',
  standalone: true,
  imports: [ClickOutsideDirective, SvgIconComponent, ReactiveFormsModule],
  templateUrl: './c-properties-dialog.component.html',
  styleUrl: './c-properties-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CPropertiesDialogComponent implements OnInit {
  @Input({ required: true }) public dialog!: PopupDataInterface;

  @Input({ required: true }) public parentId!: string;

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
      groupId: this.fb.nonNullable.control<string>(this.parentId, [
        requiredValidator(),
      ]),
    });
  }

  public closeDialog(): void {
    this.store.dispatch(PopupActions.closePopup());
    this.store.dispatch(CategoryActions.clearCGPState());
  }

  public deleteProperty(propIndex: number): void {
    this.getProperties().removeAt(propIndex);
  }

  public saveProperties(): void {
    const properties: CreateCPropertyInterface[] =
      this.cPropertiesForm.getRawValue().properties;
    this.store.dispatch(CategoryActions.addCProperties({ properties }));
  }
}
