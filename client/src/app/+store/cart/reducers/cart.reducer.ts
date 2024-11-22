import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CartActions } from '../actions/cart.actions';
import { CartDeviceInterface } from '../../../shared/models/interfaces/cart-device.interface';
import { UpdateStr } from '@ngrx/entity/src/models';

export const cartFeatureKey = 'cart';

export interface State extends EntityState<CartDeviceInterface> {
  cartId: string | null;
}

export const adapter: EntityAdapter<CartDeviceInterface> =
  createEntityAdapter<CartDeviceInterface>();

export const initialState: State = adapter.getInitialState({
  cartId: null,
});

export const reducer = createReducer(
  initialState,
  on(CartActions.addCartDeviceSuccess, (state, action) =>
    adapter.addOne(action.device, state),
  ),
  on(CartActions.updateCartDeviceSuccess, (state, action) => {
    const update: UpdateStr<CartDeviceInterface> = {
      id: action.device.id,
      changes: {
        quantity: action.device.quantity,
        isInOrder: action.device.isInOrder,
      },
    };
    return adapter.updateOne(update, state);
  }),
  on(CartActions.updateCartDevicesSuccess, (state, action) => {
    const updates: UpdateStr<CartDeviceInterface>[] = state.ids.map((id) => ({
      id: id as string,
      changes: { isInOrder: action.isInOrder },
    }));

    return adapter.updateMany(updates, state);
  }),
  on(CartActions.deleteCartDevicesSuccess, (state, action) =>
    adapter.removeMany(action.ids, state),
  ),
  on(CartActions.loadCart, (state, action) => {
    const updatedState = adapter.setAll(action.cart.devices, state);
    return {
      ...state,
      ...updatedState,
      cartId: action.cart.id,
    };
  }),
  on(CartActions.createCartSuccess, (state, action) => {
    const updatedState = adapter.setOne(action.cart.devices[0], state);
    return {
      ...state,
      ...updatedState,
      cartId: action.cart.id,
    };
  }),
  on(CartActions.clearCart, (state) => {
    const updatedState = adapter.removeAll(state);
    return {
      ...state,
      ...updatedState,
      cartId: null,
    };
  }),
);
