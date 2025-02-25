import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { FormGroup } from '@angular/forms';
import { ContactInfoFormInterface } from '../../../../../shared/models/interfaces/checkout-form.interface';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-checkout-contact-info',
  imports: [ContactFormComponent, SvgIconComponent],
  templateUrl: './checkout-contact-info.component.html',
  styleUrl: './checkout-contact-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutContactInfoComponent {
  public contactInfoForm =
    input.required<FormGroup<ContactInfoFormInterface>>();

  public isFormExpanded = false;

  public toggle(isForm: boolean): void {
    this.isFormExpanded = isForm;
  }
}
