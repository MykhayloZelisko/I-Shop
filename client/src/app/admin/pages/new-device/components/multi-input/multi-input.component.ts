import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { DPropertyFormInterface } from '../../../../../shared/models/interfaces/new-device-form.interface';
import { NgClass, NgStyle } from '@angular/common';
import {
  requiredValidator,
  showErrorMessage,
} from '../../../../../shared/utils/validators';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-multi-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgStyle, NgClass, SvgIconComponent],
  templateUrl: './multi-input.component.html',
  styleUrl: './multi-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiInputComponent implements OnInit {
  @Input({ required: true }) public label!: string;

  @Input({ required: true }) public withErrors!: boolean;

  @Input({ required: true })
  public multiInputForm!: FormGroup<DPropertyFormInterface>;

  private fb = inject(FormBuilder);

  private cdr = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.addValueCtrl();
  }

  public setHeight(): Record<string, string> {
    return this.withErrors ? { height: '56px' } : { height: 'auto' };
  }

  public getValueArrayCtrl(): FormArray<FormControl<string>> {
    return this.multiInputForm.get('value') as FormArray<FormControl<string>>;
  }

  public getValueCtrlByIndex(index: number): FormControl<string> {
    return this.getValueArrayCtrl().at(index);
  }

  public newValueCtrl(): FormControl<string> {
    return this.fb.nonNullable.control<string>('', [requiredValidator()]);
  }

  public addValueCtrl(): void {
    this.getValueArrayCtrl().push(this.newValueCtrl());
  }

  public deleteValueCtrl(index: number): void {
    this.getValueArrayCtrl().removeAt(index);
  }

  public showMessage(control: FormControl<string>): string {
    return showErrorMessage(control);
  }

  public isInvalid(index: number): boolean {
    return (
      this.getValueCtrlByIndex(index).invalid &&
      (this.getValueCtrlByIndex(index).dirty ||
        this.getValueCtrlByIndex(index).touched)
    );
  }

  public updateState(): void {
    this.cdr.markForCheck();
  }
}
