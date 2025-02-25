import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { InputComponent } from '../../../../../../../shared/components/input/input.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContactInfoFormInterface } from '../../../../../../../shared/models/interfaces/checkout-form.interface';

@Component({
  selector: 'app-contact-form',
  imports: [InputComponent, ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent {
  public contactInfoForm =
    input.required<FormGroup<ContactInfoFormInterface>>();

  public isFormExpanded = input.required<boolean>();

  public toggleForm = output<void>();

  public collapseForm(): void {
    this.toggleForm.emit();
  }
}
