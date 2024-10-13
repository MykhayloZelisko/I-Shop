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
  CPropertiesGroupFormInterface,
  CPropertiesGroupsFormInterface,
} from '../../../../../../../shared/models/interfaces/c-properties-groups-form.interface';
import { requiredValidator } from '../../../../../../../shared/utils/validators';
import { CreateCPropertiesGroupInterface } from '../../../../../../../shared/models/interfaces/create-c-properties-group.interface';
import { SharedActions } from '../../../../../../../+store/shared/actions/shared.actions';
import { CPropertiesGroupActions } from '../../../../../../../+store/c-properties-groups/actions/c-properties-group.actions';
import { CategoryInterface } from '../../../../../../../shared/models/interfaces/category.interface';

@Component({
  selector: 'app-c-properties-groups-dialog',
  standalone: true,
  imports: [ClickOutsideDirective, SvgIconComponent, ReactiveFormsModule],
  templateUrl: './c-properties-groups-dialog.component.html',
  styleUrl: './c-properties-groups-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CPropertiesGroupsDialogComponent implements OnInit {
  @Input({ required: true }) public dialog!: PopupDataInterface;

  @Input({ required: true }) public category!: CategoryInterface;

  public cPropertiesGroupsForm!: FormGroup<CPropertiesGroupsFormInterface>;

  private store = inject(Store<State>);

  private fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.initCPropertiesGroupsForm();
  }

  public initCPropertiesGroupsForm(): void {
    this.cPropertiesGroupsForm = this.fb.group<CPropertiesGroupsFormInterface>({
      groups: this.fb.array<FormGroup<CPropertiesGroupFormInterface>>([]),
    });
    this.addGroup();
  }

  public addGroup(): void {
    this.getGroups().push(this.newGroup());
  }

  public getGroups(): FormArray<FormGroup<CPropertiesGroupFormInterface>> {
    return this.cPropertiesGroupsForm.get('groups') as FormArray<
      FormGroup<CPropertiesGroupFormInterface>
    >;
  }

  public newGroup(): FormGroup<CPropertiesGroupFormInterface> {
    return this.fb.group<CPropertiesGroupFormInterface>({
      groupName: this.fb.nonNullable.control<string>('', [requiredValidator()]),
      categoryId: this.fb.nonNullable.control<string>(this.category.id, [
        requiredValidator(),
      ]),
    });
  }

  public closeDialog(): void {
    this.store.dispatch(PopupActions.closePopup());
    this.store.dispatch(SharedActions.clearCGPState());
  }

  public deleteGroup(groupIndex: number): void {
    this.getGroups().removeAt(groupIndex);
  }

  public saveGroups(): void {
    const groups: CreateCPropertiesGroupInterface[] =
      this.cPropertiesGroupsForm.getRawValue().groups;
    this.store.dispatch(
      CPropertiesGroupActions.addCPropertiesGroups({
        groups,
        category: this.category,
      }),
    );
  }
}
