import { CanActivateFn, GuardResult, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../+store/reducers';
import { selectCartId } from '../../+store/cart/selectors/cart.selectors';
import { map, Observable } from 'rxjs';
import { UserRouteNameEnum } from '../../shared/models/enums/user-route-name.enum';

export const checkoutGuard: CanActivateFn = (): Observable<GuardResult> => {
  const store = inject(Store<State>);
  const router = inject(Router);

  return store
    .select(selectCartId)
    .pipe(
      map(
        (cartId: string | null) =>
          !!cartId || router.parseUrl(UserRouteNameEnum.Home),
      ),
    );
};
