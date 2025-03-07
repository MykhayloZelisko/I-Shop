import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RecipientFormInterface } from '../../../../../shared/models/interfaces/checkout-form.interface';
import { FormGroup } from '@angular/forms';
import { RecipientFormComponent } from './components/recipient-form/recipient-form.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { PhonePipe } from '../../../../../shared/pipes/phone.pipe';

@Component({
  selector: 'app-checkout-order-recipient',
  imports: [RecipientFormComponent, SvgIconComponent, PhonePipe],
  templateUrl: './checkout-order-recipient.component.html',
  styleUrl: './checkout-order-recipient.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutOrderRecipientComponent {
  public recipientForm = input.required<FormGroup<RecipientFormInterface>>();

  public isFormExpanded = false;

  public toggle(isForm: boolean): void {
    this.isFormExpanded = isForm;
  }
}
