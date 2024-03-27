import { CanActivateFn, GuardResult, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../+store/reducers';
import { userSelector } from '../../+store/user/selectors/user.selectors';
import { UserInterface } from '../../shared/models/interfaces/user.interface';
import { UserRouteNameEnum } from '../../shared/models/enums/user-route-name.enum';

export const adminGuard: CanActivateFn = (): Observable<GuardResult> => {
  const store = inject(Store<State>);
  const router = inject(Router);

  return store.select(userSelector).pipe(
    map((user: UserInterface) => {
      if (user) {
        return true;
      } else {
        return router.parseUrl(UserRouteNameEnum.Home);
      }
    }),
  );
};
