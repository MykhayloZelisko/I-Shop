import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabMenuModule } from 'primeng/tabmenu';
import { DEVICE_MENU } from '../../../shared/models/constants/device-menu';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { DeviceActions } from '../../../+store/devices/actions/device.actions';
import { DeviceInterface } from '../../../shared/models/interfaces/device.interface';
import {
  selectDevice,
  selectIsCurrentDevice,
} from '../../../+store/devices/selectors/device.selectors';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { AsyncPipe } from '@angular/common';
import { BreadcrumbsComponent } from '../../../shared/components/breadcrumbs/breadcrumbs.component';
import { DeviceRouteNameEnum } from '../../../shared/models/enums/device-route-name.enum';
import { TabMenuItemInterface } from '../../../shared/models/interfaces/tab-menu-item.interface';
import { TabMenuComponent } from '../../../shared/components/tab-menu/tab-menu.component';

@Component({
  selector: 'app-device',
  standalone: true,
  imports: [
    RouterOutlet,
    TabMenuModule,
    PageNotFoundComponent,
    AsyncPipe,
    BreadcrumbsComponent,
    TabMenuComponent,
  ],
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceComponent implements OnInit, OnDestroy {
  public items: TabMenuItemInterface[] = DEVICE_MENU;

  public device$!: Observable<DeviceInterface | null>;

  private destroy$: Subject<void> = new Subject<void>();

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.device$ = this.store.select(selectDevice).pipe(
      tap((device) => {
        if (!device || !device.votes) {
          this.items = this.items.map((item: TabMenuItemInterface) =>
            item.route === DeviceRouteNameEnum.Comments
              ? { label: 'Залишити відгук', route: item.route }
              : item,
          );
        } else {
          this.items = this.items.map((item: TabMenuItemInterface) =>
            item.route === DeviceRouteNameEnum.Comments
              ? { label: 'Відгуки', route: item.route }
              : item,
          );
        }
      }),
    );
    this.initDevice();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public initDevice(): void {
    this.store
      .select(selectIsCurrentDevice)
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (!params.isCurrent && params.id) {
          this.store.dispatch(DeviceActions.loadDevice({ id: params.id }));
        }
      });
  }
}
