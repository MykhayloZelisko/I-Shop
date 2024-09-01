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
} from '@angular/forms';
import {
  DPropertyFormInterface,
  NewDeviceFormInterface,
} from '../../../shared/models/interfaces/new-device-form.interface';
import {
  nonEmptyArrayValidator,
  positiveNumberValidator,
  requiredValidator,
  showErrorMessage,
} from '../../../shared/utils/validators';
import { DropdownModule } from 'primeng/dropdown';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { BrandInterface } from '../../../shared/models/interfaces/brand.interface';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { selectAllBrands } from '../../../+store/brands/selectors/brand.selectors';
import { AsyncPipe, NgClass } from '@angular/common';
import {
  selectCascadeCategories,
  selectProperties,
} from '../../../+store/categories/selectors/category.selectors';
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
  ],
  templateUrl: './new-device.component.html',
  styleUrl: './new-device.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewDeviceComponent implements OnInit, OnDestroy {
  public newDeviceForm!: FormGroup<NewDeviceFormInterface>;

  public brands$!: Observable<BrandInterface[]>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public categories$!: Observable<any[]>;

  public properties$!: Observable<CPropertyInterface[]>;

  public files: File[] = [];

  private fb = inject(FormBuilder);

  private store = inject(Store<State>);

  public isFormCleared$!: Observable<boolean>;

  private destroy$: Subject<void> = new Subject<void>();

  public ngOnInit(): void {
    this.brands$ = this.store.select(selectAllBrands);
    this.categories$ = this.store.select(selectCascadeCategories);
    this.isFormCleared$ = this.store.select(selectFormCleared);
    this.initDeviceForm();
    this.clearForm();
    console.log(this.newDeviceForm);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public initDeviceForm(): void {
    this.newDeviceForm = this.fb.group<NewDeviceFormInterface>({
      deviceName: this.fb.nonNullable.control<string>('', [
        requiredValidator(),
      ]),
      price: this.fb.nonNullable.control<number>(NaN, [
        requiredValidator(),
        positiveNumberValidator(),
      ]),
      count: this.fb.nonNullable.control<number>(NaN, [
        requiredValidator(),
        positiveNumberValidator(),
      ]),
      images: this.fb.array<FormControl<File>>([], [nonEmptyArrayValidator()]),
      base64images: this.fb.array<FormControl<string>>(
        [],
        [nonEmptyArrayValidator()],
      ),
      categoryId: this.fb.nonNullable.control<string>('', [
        requiredValidator(),
      ]),
      brandId: this.fb.nonNullable.control<string>('', [requiredValidator()]),
      properties: this.fb.array<FormGroup<DPropertyFormInterface>>(
        [],
        [nonEmptyArrayValidator()],
      ),
    });
    this.newDeviceForm.markAsPristine();
  }

  public showMessage(controlName: string): string {
    const control = this.newDeviceForm.get(controlName) as FormControl;
    return showErrorMessage(control);
  }

  public showMessageArray(arrayName: string, index: number): string {
    switch (arrayName) {
      case 'properties': {
        const control = this.getPropertiesCtrl().at(index).controls.value;
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
    this.clearPropertiesCtrl();
    this.properties$ = this.store.select(selectProperties(event.value)).pipe(
      takeUntil(this.destroy$),
      tap((properties) => {
        properties.forEach((property) => {
          this.addPropertyForm(property.propertyName);
        });
      }),
    );
  }

  public addPropertyForm(propertyName: string): void {
    const propertyForm = this.fb.group<DPropertyFormInterface>({
      propertyName: this.fb.nonNullable.control<string>(propertyName, [
        requiredValidator(),
      ]),
      value: this.fb.nonNullable.control<string>('', [requiredValidator()]),
    });
    this.getPropertiesCtrl().push(propertyForm);
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

  public getPropertiesCtrl(): FormArray<FormGroup<DPropertyFormInterface>> {
    return this.newDeviceForm.get('properties') as FormArray<
      FormGroup<DPropertyFormInterface>
    >;
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

  public clearPropertiesCtrl(): void {
    this.getPropertiesCtrl().clear();
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
      properties: formData.properties,
    };
    this.store.dispatch(DeviceActions.createDevice({ device }));
  }

  public setBase64Image(image: string, index: number): void {
    this.getBase64Ctrl().at(index).setValue(image);
  }

  public getPropertyValueCtrl(index: number): FormControl<string> {
    return this.getPropertiesCtrl()
      .at(index)
      .get('value') as FormControl<string>;
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
          this.clearPropertiesCtrl();
          this.newDeviceForm.markAsPristine();
          this.store.dispatch(FormActions.clearFormOff());
        }
      });
  }

  public cancelDevice(): void {
    this.store.dispatch(FormActions.clearFormOn());
  }
}
