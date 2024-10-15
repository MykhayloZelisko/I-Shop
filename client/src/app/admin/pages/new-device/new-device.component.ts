import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgxMaskDirective } from 'ngx-mask';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import {
  DPropertiesGroupFormInterface,
  DPropertyFormInterface,
  NewDeviceFormInterface,
} from '../../../shared/models/interfaces/new-device-form.interface';
import {
  maxArrayLengthValidator,
  nonEmptyArrayValidator,
  positiveNumberValidator,
  requiredValidator,
  showErrorMessage,
} from '../../../shared/utils/validators';
import { DropdownModule } from 'primeng/dropdown';
import { Observable, Subject, take, takeUntil, tap } from 'rxjs';
import { BrandInterface } from '../../../shared/models/interfaces/brand.interface';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { selectAllBrands } from '../../../+store/brands/selectors/brand.selectors';
import { AsyncPipe, NgClass } from '@angular/common';
import { selectCascadeCategories } from '../../../+store/categories/selectors/category.selectors';
import {
  CascadeSelectChangeEvent,
  CascadeSelectModule,
} from 'primeng/cascadeselect';
import { CPropertyInterface } from '../../../shared/models/interfaces/c-property.interface';
import { FileControlComponent } from './components/file-control/file-control.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { CreateDeviceInterface } from '../../../shared/models/interfaces/create-device.interface';
import { DeviceActions } from '../../../+store/devices/actions/device.actions';
import { FormActions } from '../../../+store/form/actions/form.actions';
import { selectFormCleared } from '../../../+store/form/selectors/form.selectors';
import { InputComponent } from '../../../shared/components/input/input.component';
import { GPTreeInterface } from '../../../shared/models/interfaces/g-p-tree.interface';
import {
  selectGPTreeById,
  selectLoadGroupsAndPropertiesForCategory,
} from '../../../+store/shared/selectors/shared.selectors';
import { SharedActions } from '../../../+store/shared/actions/shared.actions';
import { CPropertyActions } from '../../../+store/c-properties/actions/c-property.actions';

@Component({
  selector: 'app-new-device',
  standalone: true,
  imports: [
    NgxMaskDirective,
    ReactiveFormsModule,
    DropdownModule,
    AsyncPipe,
    NgClass,
    CascadeSelectModule,
    FileControlComponent,
    SvgIconComponent,
    InputComponent,
  ],
  templateUrl: './new-device.component.html',
  styleUrl: './new-device.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewDeviceComponent implements OnInit, OnDestroy {
  protected readonly requiredValidators: ValidatorFn[] = [requiredValidator()];

  public newDeviceForm!: FormGroup<NewDeviceFormInterface>;

  public brands$!: Observable<BrandInterface[]>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public categories$!: Observable<any[]>;

  public propertiesGroups$!: Observable<GPTreeInterface[]>;

  public files: File[] = [];

  public isFormCleared$!: Observable<boolean>;

  private fb = inject(FormBuilder);

  private store = inject(Store<State>);

  private destroy$: Subject<void> = new Subject<void>();

  public ngOnInit(): void {
    this.brands$ = this.store.select(selectAllBrands);
    this.categories$ = this.store.select(selectCascadeCategories);
    this.isFormCleared$ = this.store.select(selectFormCleared);
    this.initDeviceForm();
    this.clearForm();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public initDeviceForm(): void {
    this.newDeviceForm = this.fb.group<NewDeviceFormInterface>({
      deviceName: this.fb.nonNullable.control<string>('', []),
      price: this.fb.control<number | null>(null, [
        requiredValidator(),
        positiveNumberValidator(),
      ]),
      count: this.fb.nonNullable.control<number | null>(null, [
        requiredValidator(),
        positiveNumberValidator(),
      ]),
      images: this.fb.array<FormControl<File>>(
        [],
        [nonEmptyArrayValidator('images'), maxArrayLengthValidator(6)],
      ),
      base64images: this.fb.array<FormControl<string>>(
        [],
        [nonEmptyArrayValidator('images'), maxArrayLengthValidator(6)],
      ),
      categoryId: this.fb.nonNullable.control<string>('', [
        requiredValidator(),
      ]),
      brandId: this.fb.nonNullable.control<string>('', [requiredValidator()]),
      groups: this.fb.array<FormGroup<DPropertiesGroupFormInterface>>(
        [],
        [nonEmptyArrayValidator('groups')],
      ),
    });
    this.newDeviceForm.markAsPristine();
  }

  public showMessage(controlName: string): string {
    const control = this.newDeviceForm.get(controlName) as FormControl;
    return showErrorMessage(control);
  }

  public showMessageArrayItem(arrayName: string, index: number): string {
    switch (arrayName) {
      case 'groups': {
        const control = this.getPropertiesCtrl(index);
        return showErrorMessage(control);
      }
      case 'images': {
        const control = this.getImagesCtrl().at(index);
        return showErrorMessage(control);
      }
      default:
        return '';
    }
  }

  public changeValue(event: CascadeSelectChangeEvent): void {
    this.clearGroupsCtrl();
    this.loadGroupsAndProperties(event.value);

    this.propertiesGroups$ = this.store
      .select(selectGPTreeById(event.value))
      .pipe(
        tap((groups) => {
          let hasGroups = false;

          groups.forEach((group) => {
            if (group.hasProperties && group.properties.length) {
              this.addGroupCtrl(group);
              hasGroups = true;
            }
            if (!group.hasProperties) {
              this.getGroupsCtrl().push(this.newGroupCtrl(group.groupName));
              hasGroups = true;
            }
          });

          if (event.value && !hasGroups) {
            this.newDeviceForm.controls.categoryId.setErrors({
              nonEmptyArray: this.showMessage('groups'),
            });
          } else if (hasGroups) {
            this.newDeviceForm.controls.categoryId.setErrors(null);
          }
        }),
      );
  }

  private loadGroupsAndProperties(categoryId: string): void {
    this.store
      .select(selectLoadGroupsAndPropertiesForCategory(categoryId))
      .pipe(
        take(1),
        tap((gpState) => {
          if (gpState.loadGroups) {
            this.store.dispatch(
              SharedActions.addGroupsWithProperties({ id: categoryId }),
            );
          } else if (
            !gpState.loadProperties.allGroups &&
            gpState.loadProperties.groupsIds.length
          ) {
            this.store.dispatch(
              CPropertyActions.addCPropertiesByGroupsIds({
                ids: gpState.loadProperties.groupsIds,
              }),
            );
          }
        }),
      )
      .subscribe();
  }

  public uploadFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const selectedFiles = input.files;
      for (let i = 0; i < selectedFiles.length; i++) {
        this.files.push(selectedFiles.item(i) as File);
        this.addImageCtrl(selectedFiles.item(i) as File);
        this.addBase64Ctrl();
      }
    }
  }

  public getImagesCtrl(): FormArray<FormControl<File>> {
    return this.newDeviceForm.get('images') as FormArray<FormControl<File>>;
  }

  public getBase64Ctrl(): FormArray<FormControl<string>> {
    return this.newDeviceForm.get('base64images') as FormArray<
      FormControl<string>
    >;
  }

  public getPropertiesCtrl(
    index: number,
  ): FormArray<FormGroup<DPropertyFormInterface>> {
    return this.getGroupsCtrl().at(index).get('properties') as FormArray<
      FormGroup<DPropertyFormInterface>
    >;
  }

  public addPropertyCtrl(
    groupIndex: number,
    property: CPropertyInterface,
  ): void {
    this.getPropertiesCtrl(groupIndex).push(
      this.newPropertyCtrl(property.propertyName),
    );
  }

  public newPropertyCtrl(
    propertyName: string,
  ): FormGroup<DPropertyFormInterface> {
    return this.fb.group<DPropertyFormInterface>({
      propertyName: this.fb.nonNullable.control<string>(propertyName, [
        requiredValidator(),
      ]),
      value: this.fb.nonNullable.control<string>('', [requiredValidator()]),
    });
  }

  public getGroupsCtrl(): FormArray<FormGroup<DPropertiesGroupFormInterface>> {
    return this.newDeviceForm.get('groups') as FormArray<
      FormGroup<DPropertiesGroupFormInterface>
    >;
  }

  public addGroupCtrl(group: GPTreeInterface): void {
    const groupIndex = this.getGroupsCtrl().length;
    this.getGroupsCtrl().push(this.newGroupCtrl(group.groupName));
    group.properties.forEach((property: CPropertyInterface) => {
      this.addPropertyCtrl(groupIndex, property);
    });
  }

  public newGroupCtrl(
    groupName: string,
  ): FormGroup<DPropertiesGroupFormInterface> {
    return this.fb.group<DPropertiesGroupFormInterface>({
      groupName: this.fb.nonNullable.control<string>(groupName, [
        requiredValidator(),
      ]),
      properties: this.fb.array<FormGroup<DPropertyFormInterface>>(
        [],
        [nonEmptyArrayValidator('properties')],
      ),
    });
  }

  public addImageCtrl(file: File): void {
    const control = this.fb.nonNullable.control<File>(file, [
      requiredValidator(),
    ]);
    this.getImagesCtrl().push(control);
  }

  public addBase64Ctrl(): void {
    const control = this.fb.nonNullable.control<string>('', [
      requiredValidator(),
    ]);
    this.getBase64Ctrl().push(control);
  }

  public deleteImageCtrl(imageIndex: number): void {
    this.getImagesCtrl().removeAt(imageIndex);
    this.files.splice(imageIndex, 1);
    this.getBase64Ctrl().removeAt(imageIndex);
  }

  public clearGroupsCtrl(): void {
    this.getGroupsCtrl().clear();
  }

  public clearBase64Ctrl(): void {
    this.getBase64Ctrl().clear();
  }

  public clearImagesCtrl(): void {
    this.getImagesCtrl().clear();
  }

  public saveDevice(): void {
    const formData = this.newDeviceForm.getRawValue();
    const device: CreateDeviceInterface = {
      brandId: formData.brandId,
      categoryId: formData.categoryId,
      count: Number(formData.count),
      deviceName: formData.deviceName,
      images: formData.base64images,
      price: Number(formData.price),
      groups: formData.groups,
    };
    this.store.dispatch(DeviceActions.createDevice({ device }));
  }

  public setBase64Image(image: string, index: number): void {
    this.getBase64Ctrl().at(index).setValue(image);
  }

  public clearForm(): void {
    this.isFormCleared$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isFormCleared) => {
        if (isFormCleared) {
          this.files = [];
          this.newDeviceForm.reset();
          this.clearBase64Ctrl();
          this.clearImagesCtrl();
          this.clearGroupsCtrl();
          this.newDeviceForm.markAsPristine();
          this.store.dispatch(FormActions.clearFormOff());
        }
      });
  }

  public cancelDevice(): void {
    this.store.dispatch(FormActions.clearFormOn());
  }
}
