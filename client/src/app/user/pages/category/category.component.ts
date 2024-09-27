import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { combineLatestWith, Observable, Subject, takeUntil } from 'rxjs';
import { CascadeCategoryInterface } from '../../../shared/models/interfaces/cascade-category.interface';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import {
  selectCascadeSubCategories,
  selectHasChildChain,
} from '../../../+store/categories/selectors/category.selectors';
import { AsyncPipe, NgClass } from '@angular/common';
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
import { PAGE_SIZE } from '../../../shared/models/constants/page-size';
import { PaginationParamsInterface } from '../../../shared/models/interfaces/pagination-params.interface';
import { RouterParamsInterface } from '../../../shared/models/interfaces/router-params.interface';
import { Router } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    AsyncPipe,
    PageNotFoundComponent,
    FilterComponent,
    SubCategoryItemComponent,
    DeviceItemComponent,
    NgClass,
    PaginatorModule,
    SvgIconComponent,
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

  public currentPage!: number;

  public currentId: string | null = null;

  private destroy$: Subject<void> = new Subject<void>();

  private store = inject(Store<State>);

  private router = inject(Router);

  public ngOnInit(): void {
    this.initSubscribes();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public initSubscribes(): void {
    this.paginationParams$ = this.store.select(selectPaginationParams);
    this.cascadeCategories$ = this.store.select(selectCascadeSubCategories);
    this.hasChildChain$ = this.store.select(selectHasChildChain);
    this.devices$ = this.store.select(selectAllDevices);
    this.initDevicesList();
  }

  public initDevicesList(): void {
    this.store
      .select(selectIdAndPage)
      .pipe(combineLatestWith(this.hasChildChain$), takeUntil(this.destroy$))
      .subscribe(([params, result]: [RouterParamsInterface, boolean]) => {
        if (params && params.id) {
          if (this.currentId !== params.id) {
            this.currentId = params.id;
            this.currentPage = params.page ? Number(params.page) : 1;

            if (!result) {
              this.store.dispatch(
                DeviceActions.loadDevices({
                  id: this.currentId,
                  size: PAGE_SIZE,
                  page: +this.currentPage,
                }),
              );
            }
          }
        }
      });
  }

  public loadMore(): void {
    this.currentPage += 1;

    if (this.currentId) {
      this.store.dispatch(
        DeviceActions.addDevices({
          id: this.currentId,
          size: PAGE_SIZE,
          page: this.currentPage,
        }),
      );
    }

    this.router.navigate([], {
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge',
    });
  }

  public pageChange(event: PaginatorState): void {
    if (event.page !== this.currentPage - 1) {
      this.currentPage = event.page ? event.page + 1 : 1;

      if (this.currentId) {
        this.store.dispatch(
          DeviceActions.loadDevices({
            id: this.currentId,
            size: PAGE_SIZE,
            page: this.currentPage,
          }),
        );
      }

      this.router.navigate([], {
        queryParams: { page: this.currentPage },
        queryParamsHandling: 'merge',
      });
    }
  }
}
