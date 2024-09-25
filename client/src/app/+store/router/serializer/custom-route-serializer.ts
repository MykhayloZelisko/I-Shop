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

    while (route.firstChild) {
      route = route.firstChild;
    }

    const {
      url,
      root: { queryParams },
    } = routerState;
    const { params } = route;

    return { url, params, queryParams };
  }
}
