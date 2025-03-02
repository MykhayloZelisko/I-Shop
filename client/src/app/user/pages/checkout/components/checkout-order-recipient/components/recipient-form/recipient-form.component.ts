import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecipientFormInterface } from '../../../../../../../shared/models/interfaces/checkout-form.interface';
import { InputComponent } from '../../../../../../../shared/components/input/input.component';

@Component({
  selector: 'app-recipient-form',
  imports: [FormsModule, InputComponent, ReactiveFormsModule],
  templateUrl: './recipient-form.component.html',
  styleUrl: './recipient-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipientFormComponent {
  public recipientForm = input.required<FormGroup<RecipientFormInterface>>();

  public toggleForm = output<void>();

  public collapseForm(): void {
    this.toggleForm.emit();
  }
}
