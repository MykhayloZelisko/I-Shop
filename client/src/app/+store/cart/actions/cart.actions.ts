import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CartDeviceInterface } from '../../../shared/models/interfaces/cart-device.interface';
import { CartInterface } from '../../../shared/models/interfaces/cart.interface';
import { UpdateCartDeviceInterface } from '../../../shared/models/interfaces/update-cart-device.interface';
import { UpdateCartDevicesInterface } from '../../../shared/models/interfaces/update-cart-devices.interface';

export const CartActions = createActionGroup({
  source: 'Cart/API',
  events: {
    // Cart actions
    LoadCart: props<{ cart: CartInterface }>(),
    CheckCart: props<{ deviceId: string }>(),
    CreateCart: props<{ deviceId: string }>(),
    CreateCartSuccess: props<{ cart: CartInterface }>(),
    CreateCartFailure: emptyProps(),
    ClearCart: emptyProps(),
    // Device actions
    AddCartDevice: props<{ deviceId: string; cartId: string }>(),
    AddCartDeviceSuccess: props<{ device: CartDeviceInterface }>(),
    AddCartDeviceFailure: emptyProps(),
    UpdateCartDevice: props<{
      id: string;
      device: UpdateCartDeviceInterface;
    }>(),
    UpdateCartDeviceSuccess: props<{ device: CartDeviceInterface }>(),
    UpdateCartDeviceFailure: emptyProps(),
    UpdateCartDevices: props<{
      payload: UpdateCartDevicesInterface;
    }>(),
    UpdateCartDevicesSuccess: props<{ isInOrder: boolean }>(),
    UpdateCartDevicesFailure: emptyProps(),
    DeleteCartDevices: props<{ deviceIds: string[]; cartId: string }>(),
    DeleteCartDevicesSuccess: props<{ ids: string[] }>(),
    DeleteCartDevicesFailure: emptyProps(),
  },
});
