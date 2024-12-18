import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { DeviceInterface } from '../../../../../shared/models/interfaces/device.interface';
import { RouterLink } from '@angular/router';
import { RatingComponent } from '../../../../../shared/components/rating/rating.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { selectDeviceInCart } from '../../../../../+store/cart/selectors/cart.selectors';
import { CartActions } from '../../../../../+store/cart/actions/cart.actions';
import { AsyncPipe } from '@angular/common';
import { PopupActions } from '../../../../../+store/popup/actions/popup.actions';
import { PopupTypeEnum } from '../../../../../shared/models/enums/popup-type.enum';

@Component({
  selector: 'app-device-item',
  standalone: true,
  imports: [RouterLink, RatingComponent, SvgIconComponent, AsyncPipe],
  templateUrl: './device-item.component.html',
  styleUrl: './device-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceItemComponent implements OnInit {
  public device = input.required<DeviceInterface>();

  public isCartDevice$!: Observable<boolean>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.isCartDevice$ = this.store.select(
      selectDeviceInCart(this.device().id),
    );
  }

  public addDevice(): void {
    this.store.dispatch(CartActions.checkCart({ deviceId: this.device().id }));
  }

  public openCart(): void {
    this.store.dispatch(
      PopupActions.openPopup({
        popup: {
          title: 'Кошик',
          popupType: PopupTypeEnum.Cart,
        },
      }),
    );
  }
}
