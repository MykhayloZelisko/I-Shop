import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { DeviceInterface } from '../../models/interfaces/device.interface';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { selectDeviceInCart } from '../../../+store/cart/selectors/cart.selectors';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { CartActions } from '../../../+store/cart/actions/cart.actions';
import { PopupActions } from '../../../+store/popup/actions/popup.actions';
import { PopupTypeEnum } from '../../models/enums/popup-type.enum';

@Component({
  selector: 'app-device-aside',
  standalone: true,
  imports: [SvgIconComponent, AsyncPipe],
  templateUrl: './device-aside.component.html',
  styleUrl: './device-aside.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceAsideComponent implements OnInit {
  @Input({ required: true }) public device!: DeviceInterface;

  public isCartDevice$!: Observable<boolean>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.isCartDevice$ = this.store.select(selectDeviceInCart(this.device.id));
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
