import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CartDeviceInterface } from '../../../../../../../shared/models/interfaces/cart-device.interface';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout-list-item',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './checkout-list-item.component.html',
  styleUrl: './checkout-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutListItemComponent {
  public device = input.required<CartDeviceInterface>();
}
