import {
  createFeature,
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';
import {
  adapter,
  cartFeatureKey,
  reducer,
  State,
} from '../reducers/cart.reducer';
import { selectIdAndPage } from '../../router/selectors/router.selectors';
import { RouterParamsInterface } from '../../../shared/models/interfaces/router-params.interface';
import { CartDeviceInterface } from '../../../shared/models/interfaces/cart-device.interface';

const selectCartState = createFeatureSelector<State>(cartFeatureKey);

export const cartDevicesFeature = createFeature({
  name: cartFeatureKey,
  reducer,
  extraSelectors: ({ selectCartState: selectCartDevicesState }) => ({
    ...adapter.getSelectors(selectCartDevicesState),
  }),
});

export const selectAllCDevices = cartDevicesFeature.selectAll;

export const selectEntitiesCDevices = cartDevicesFeature.selectEntities;

export const selectIdsCDevices = cartDevicesFeature.selectIds;

export const selectTotalCDevices = cartDevicesFeature.selectTotal;

export const selectCartId = createSelector(
  selectCartState,
  (state: State) => state.cartId,
);

export const selectDeviceInCart = (
  deviceId?: string,
): MemoizedSelector<NonNullable<unknown>, boolean> =>
  createSelector(
    selectIdAndPage,
    selectAllCDevices,
    (params: RouterParamsInterface, devices: CartDeviceInterface[]) => {
      const newId = deviceId ?? params.id;
      return newId
        ? devices.some(
            (device: CartDeviceInterface) => device.device.id === newId,
          )
        : false;
    },
  );

export const selectOrderedItemsCount = createSelector(
  selectAllCDevices,
  (devices: CartDeviceInterface[]) =>
    devices.filter((device: CartDeviceInterface) => device.isInOrder).length,
);

export const selectCartInfo = createSelector(
  selectTotalCDevices,
  selectOrderedItemsCount,
  (total: number, ordered: number) => ({
    count: ordered > 0 ? ordered : total,
    isOrder: ordered > 0,
  }),
);

export const selectTotalPrice = createSelector(
  selectAllCDevices,
  (devices: CartDeviceInterface[]) =>
    devices.reduce((acc: number, device: CartDeviceInterface) => {
      return device.isInOrder ? acc + device.quantity * device.priceAtAdd : acc;
    }, 0),
);
