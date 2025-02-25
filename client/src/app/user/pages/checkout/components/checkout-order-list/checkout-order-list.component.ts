import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-checkout-order-list',
  imports: [],
  templateUrl: './checkout-order-list.component.html',
  styleUrl: './checkout-order-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutOrderListComponent {}
