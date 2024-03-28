import { CanActivateFn, GuardResult, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../+store/reducers';
import { selectAdmin } from '../../+store/user/selectors/user.selectors';
import { UserRouteNameEnum } from '../../shared/models/enums/user-route-name.enum';

export const adminGuard: CanActivateFn = (): Observable<GuardResult> => {
  const store = inject(Store<State>);
  const router = inject(Router);

  return store
    .select(selectAdmin)
    .pipe(
      map(
        (isAdmin: boolean) =>
          isAdmin || router.parseUrl(UserRouteNameEnum.Home),
      ),
    );
};
