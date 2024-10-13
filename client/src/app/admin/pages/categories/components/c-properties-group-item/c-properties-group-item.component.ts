import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { CPropertiesGroupInterface } from '../../../../../shared/models/interfaces/c-properties-group.interface';
import { Observable } from 'rxjs';
import { CurrentStatusInterface } from '../../../../../shared/models/interfaces/current-status.interface';
import { selectCurrentGroup } from '../../../../../+store/c-properties-groups/selectors/c-properties-group.selectors';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { AsyncPipe, NgClass } from '@angular/common';
import { PopupDataInterface } from '../../../../../shared/models/interfaces/popup-data.interface';
import { selectPopup } from '../../../../../+store/popup/selectors/popup.selectors';
import { PopupTypeEnum } from '../../../../../shared/models/enums/popup-type.enum';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CPropertiesDialogComponent } from './components/c-properties-dialog/c-properties-dialog.component';
import { requiredValidator } from '../../../../../shared/utils/validators';
import { CPropertiesGroupActions } from '../../../../../+store/c-properties-groups/actions/c-properties-group.actions';
import { SvgIconComponent } from 'angular-svg-icon';
import { PopupActions } from '../../../../../+store/popup/actions/popup.actions';
import { SharedActions } from '../../../../../+store/shared/actions/shared.actions';

@Component({
  selector: 'app-c-properties-group-item',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    ReactiveFormsModule,
    CPropertiesDialogComponent,
    SvgIconComponent,
  ],
  templateUrl: './c-properties-group-item.component.html',
  styleUrl: './c-properties-group-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CPropertiesGroupItemComponent implements OnInit {
  @Input({ required: true }) public group!: CPropertiesGroupInterface;

  public readonly dialogEnum = PopupTypeEnum;

  public currentGroup$!: Observable<CurrentStatusInterface>;

  public dialog$!: Observable<PopupDataInterface>;

  public groupCtrl!: FormControl<string>;

  private store = inject(Store<State>);

  private fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.currentGroup$ = this.store.select(selectCurrentGroup);
    this.dialog$ = this.store.select(selectPopup);
    this.groupCtrl = this.fb.nonNullable.control<string>(this.group.groupName, [
      requiredValidator(),
    ]);
  }

  public editGroup(): void {
    this.store.dispatch(
      SharedActions.updateCGPState({
        payload: {
          currentPropertyId: null,
          isNewCategory: false,
          currentCategory: { id: null, isEditable: false },
          currentGroup: { id: this.group.id, isEditable: true },
        },
      }),
    );
  }

  public saveGroup(): void {
    const groupName = this.groupCtrl.getRawValue();
    this.store.dispatch(
      CPropertiesGroupActions.updateCPropertiesGroup({
        id: this.group.id,
        groupName,
      }),
    );
  }

  public cancelEditGroup(): void {
    this.store.dispatch(SharedActions.clearCGPState());
    this.groupCtrl.setValue(this.group.groupName);
  }

  public deleteGroup(): void {
    this.store.dispatch(
      CPropertiesGroupActions.deleteCPropertiesGroup({ id: this.group.id }),
    );
  }

  public openPropertiesDialog(): void {
    this.store.dispatch(
      PopupActions.openPopup({
        popup: {
          title: 'Характеристики',
          popupType: PopupTypeEnum.CProperties,
        },
      }),
    );
    this.store.dispatch(
      SharedActions.updateCGPState({
        payload: {
          currentPropertyId: null,
          isNewCategory: false,
          currentCategory: { id: null, isEditable: false },
          currentGroup: { id: this.group.id, isEditable: false },
        },
      }),
    );
  }
}
