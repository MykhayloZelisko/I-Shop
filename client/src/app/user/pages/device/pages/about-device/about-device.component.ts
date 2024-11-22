import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { selectDevice } from '../../../../../+store/devices/selectors/device.selectors';
import { Observable } from 'rxjs';
import { DeviceInterface } from '../../../../../shared/models/interfaces/device.interface';
import { AsyncPipe } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { RatingComponent } from '../../../../../shared/components/rating/rating.component';
import { DeviceCarouselComponent } from './components/device-carousel/device-carousel.component';
import { PopupActions } from '../../../../../+store/popup/actions/popup.actions';
import { PopupTypeEnum } from '../../../../../shared/models/enums/popup-type.enum';
import { CartActions } from '../../../../../+store/cart/actions/cart.actions';
import { selectDeviceInCart } from '../../../../../+store/cart/selectors/cart.selectors';

@Component({
  selector: 'app-about-device',
  standalone: true,
  imports: [
    AsyncPipe,
    SvgIconComponent,
    RatingComponent,
    DeviceCarouselComponent,
  ],
  templateUrl: './about-device.component.html',
  styleUrl: './about-device.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutDeviceComponent implements OnInit {
  public device$!: Observable<DeviceInterface | null>;

  public isCartDevice$!: Observable<boolean>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.device$ = this.store.select(selectDevice);
    this.isCartDevice$ = this.store.select(selectDeviceInCart());
  }

  public addDevice(deviceId: string): void {
    this.store.dispatch(CartActions.checkCart({ deviceId }));
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
