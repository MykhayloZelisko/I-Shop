import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CartDeviceInterface } from '../../../../../shared/models/interfaces/cart-device.interface';
import { CheckoutListItemComponent } from './components/checkout-list-item/checkout-list-item.component';

@Component({
  selector: 'app-checkout-order-list',
  imports: [CheckoutListItemComponent],
  templateUrl: './checkout-order-list.component.html',
  styleUrl: './checkout-order-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutOrderListComponent {
  public totalPrice = input.required<number>();

  public devices = input.required<CartDeviceInterface[]>();
}
