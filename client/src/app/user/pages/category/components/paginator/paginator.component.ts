import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SharedModule } from 'primeng/api';
import { SvgIconComponent } from 'angular-svg-icon';
import { PaginationParamsInterface } from '../../../../../shared/models/interfaces/pagination-params.interface';
import { NgClass } from '@angular/common';
import { DeviceActions } from '../../../../../+store/devices/actions/device.actions';
import { DEVICES_PAGE_SIZE } from '../../../../../shared/models/constants/page-size';
import { RouterParamsInterface } from '../../../../../shared/models/interfaces/router-params.interface';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [PaginatorModule, SharedModule, SvgIconComponent, NgClass],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  public paginationParams = input.required<PaginationParamsInterface>();

  public routerParams = input.required<RouterParamsInterface>();

  private store = inject(Store<State>);

  private router = inject(Router);

  public pageChange(event: PaginatorState): void {
    if (event.page !== this.routerParams().page - 1) {
      this.routerParams().page = event.page ? event.page + 1 : 1;
      const routeId = this.routerParams().id;

      if (routeId) {
        this.store.dispatch(
          DeviceActions.loadDevices({
            id: routeId,
            size: DEVICES_PAGE_SIZE,
            page: this.routerParams().page,
          }),
        );
      }

      this.router.navigate([], {
        queryParams: { page: this.routerParams().page },
        queryParamsHandling: 'merge',
      });
    }
  }

  public loadMore(): void {
    this.routerParams().page += 1;
    const routeId = this.routerParams().id;

    if (routeId) {
      this.store.dispatch(
        DeviceActions.addDevices({
          id: routeId,
          size: DEVICES_PAGE_SIZE,
          page: this.routerParams().page,
        }),
      );
    }

    this.router.navigate([], {
      queryParams: { page: this.routerParams().page },
      queryParamsHandling: 'merge',
    });
  }
}
