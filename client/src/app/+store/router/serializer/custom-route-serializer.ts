import { RouterStateSerializer } from '@ngrx/router-store';
import { Params, RouterStateSnapshot } from '@angular/router';

export interface RouterStateUrlInterface {
  url: string;
  params: Params;
  queryParams: Params;
}

export class CustomRouteSerializer
  implements RouterStateSerializer<RouterStateUrlInterface>
{
  public serialize(routerState: RouterStateSnapshot): RouterStateUrlInterface {
    let route = routerState.root;
    let params: Params = {};

    while (route.firstChild) {
      params = { ...params, ...route.params };
      route = route.firstChild;
    }

    const {
      url,
      root: { queryParams },
    } = routerState;
    params = { ...params, ...route.params };

    return { url, params, queryParams };
  }
}
