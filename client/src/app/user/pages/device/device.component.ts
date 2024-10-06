// import {
//   ChangeDetectionStrategy,
//   Component,
//   inject,
//   OnDestroy,
//   OnInit,
// } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { TabMenuModule } from 'primeng/tabmenu';
// import { MenuItem } from 'primeng/api';
// import { DEVICE_MENU } from '../../../shared/models/constants/device-menu';
// import { Observable, Subject, takeUntil } from 'rxjs';
// import { Store } from '@ngrx/store';
// import { State } from '../../../+store/reducers';
// import { DeviceActions } from '../../../+store/devices/actions/device.actions';
// import { DeviceInterface } from '../../../shared/models/interfaces/device.interface';
// import {
//   selectDevice,
//   selectIsCurrentDevice,
// } from '../../../+store/devices/selectors/device.selectors';
// import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
// import { AsyncPipe } from '@angular/common';
// import { BreadcrumbsComponent } from '../../../shared/components/breadcrumbs/breadcrumbs.component';
//
// @Component({
//   selector: 'app-device',
//   standalone: true,
//   imports: [
//     RouterOutlet,
//     TabMenuModule,
//     PageNotFoundComponent,
//     AsyncPipe,
//     BreadcrumbsComponent,
//   ],
//   templateUrl: './device.component.html',
//   styleUrl: './device.component.scss',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class DeviceComponent implements OnInit, OnDestroy {
//   public readonly items: MenuItem[] = DEVICE_MENU;
//
//   public device$!: Observable<DeviceInterface | null>;
//
//   private destroy$: Subject<void> = new Subject<void>();
//
//   private store = inject(Store<State>);
//
//   public ngOnInit(): void {
//     this.device$ = this.store.select(selectDevice);
//     this.initDevice();
//   }
//
//   public ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }
//
//   public initDevice(): void {
//     this.store
//       .select(selectIsCurrentDevice)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (params) => {
//           if (!params.isCurrent && params.id) {
//             this.store.dispatch(DeviceActions.loadDevice({ id: params.id }));
//           }
//         },
//       });
//   }
// }
