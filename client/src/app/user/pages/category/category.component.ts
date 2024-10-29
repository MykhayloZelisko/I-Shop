import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { CascadeCategoryInterface } from '../../../shared/models/interfaces/cascade-category.interface';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import {
  selectCascadeSubCategories,
  selectHasChildChain,
} from '../../../+store/categories/selectors/category.selectors';
import { AsyncPipe } from '@angular/common';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { DeviceInterface } from '../../../shared/models/interfaces/device.interface';
import { DeviceActions } from '../../../+store/devices/actions/device.actions';
import {
  selectAllDevices,
  selectPaginationParams,
} from '../../../+store/devices/selectors/device.selectors';
import { selectIdAndPage } from '../../../+store/router/selectors/router.selectors';
import { FilterComponent } from './components/filter/filter.component';
import { SubCategoryItemComponent } from './components/sub-category-item/sub-category-item.component';
import { DeviceItemComponent } from './components/device-item/device-item.component';
import { DEVICES_PAGE_SIZE } from '../../../shared/models/constants/page-size';
import { PaginationParamsInterface } from '../../../shared/models/interfaces/pagination-params.interface';
import { RouterParamsInterface } from '../../../shared/models/interfaces/router-params.interface';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { BreadcrumbsComponent } from '../../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    AsyncPipe,
    PageNotFoundComponent,
    FilterComponent,
    SubCategoryItemComponent,
    DeviceItemComponent,
    PaginatorComponent,
    BreadcrumbsComponent,
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent implements OnInit, OnDestroy {
  public hasChildChain$!: Observable<boolean>;

  public cascadeCategories$!: Observable<CascadeCategoryInterface | null>;

  public devices$!: Observable<DeviceInterface[]>;

  public paginationParams$!: Observable<PaginationParamsInterface>;

  public routerParams: RouterParamsInterface = {
    id: null,
    page: 0,
  };

  private destroy$: Subject<void> = new Subject<void>();

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.paginationParams$ = this.store.select(selectPaginationParams);
    this.cascadeCategories$ = this.store.select(selectCascadeSubCategories);
    this.hasChildChain$ = this.store.select(selectHasChildChain);
    this.devices$ = this.store.select(selectAllDevices);
    this.initDevicesList();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public initDevicesList(): void {
    this.store
      .select(selectIdAndPage)
      .pipe(
        switchMap((params) => {
          return this.hasChildChain$.pipe(
            map((result) => ({ params, result })),
          );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(({ params, result }) => {
        if (params && params.id) {
          if (this.routerParams?.id !== params.id) {
            this.routerParams = {
              id: params.id,
              page: params.page ? Number(params.page) : 1,
            };

            if (!result && this.routerParams.id) {
              this.store.dispatch(
                DeviceActions.loadDevices({
                  id: this.routerParams.id,
                  size: DEVICES_PAGE_SIZE,
                  page: +this.routerParams.page,
                }),
              );
            }
          }
        }
      });
  }
}
