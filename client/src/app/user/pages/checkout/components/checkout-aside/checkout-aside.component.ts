import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { selectOrderedItemsCount } from '../../../../../+store/cart/selectors/cart.selectors';
import { DevicesPipe } from '../../../../../shared/pipes/devices.pipe';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-checkout-aside',
  imports: [DevicesPipe, AsyncPipe],
  templateUrl: './checkout-aside.component.html',
  styleUrl: './checkout-aside.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAsideComponent implements OnInit {
  public totalPrice = input.required<number>();

  public isInvalid = input.required<boolean>();

  public clickEvent = output<void>();

  public orderedCount$!: Observable<number>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.orderedCount$ = this.store.select(selectOrderedItemsCount);
  }

  public createOrder(): void {
    this.clickEvent.emit();
  }
}
