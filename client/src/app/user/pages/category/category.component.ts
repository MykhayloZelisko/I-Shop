import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { AsyncPipe } from '@angular/common';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { DeviceInterface } from '../../../shared/models/interfaces/device.interface';
import { DeviceActions } from '../../../+store/devices/actions/device.actions';
import { selectAllDevices } from '../../../+store/devices/selectors/device.selectors';
import { selectId } from '../../../+store/router/selectors/router.selectors';
import { FilterComponent } from './components/filter/filter.component';
import { SubCategoryItemComponent } from './components/sub-category-item/sub-category-item.component';
import { DeviceItemComponent } from './components/device-item/device-item.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    AsyncPipe,
    PageNotFoundComponent,
    FilterComponent,
    SubCategoryItemComponent,
    DeviceItemComponent,
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent implements OnInit, OnDestroy {
  public hasChildChain$!: Observable<boolean>;

  public cascadeCategories$!: Observable<CascadeCategoryInterface | null>;

  public devices$!: Observable<DeviceInterface[]>;

  private destroy$: Subject<void> = new Subject<void>();

  private store = inject(Store<State>);

  private cdr = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.initSubscribes();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public initSubscribes(): void {
    this.cascadeCategories$ = this.store.select(selectCascadeSubCategories);
    this.hasChildChain$ = this.store.select(selectHasChildChain);
    this.devices$ = this.store.select(selectAllDevices);
    this.store
      .select(selectId)
      .pipe(combineLatestWith(this.hasChildChain$), takeUntil(this.destroy$))
      .subscribe(([id, result]: [string | null, boolean]) => {
        if (!result && id) {
          this.store.dispatch(
            DeviceActions.loadDevices({
              id,
              size: 60,
              page: 1,
            }),
          );
        }
        this.cdr.detectChanges();
      });
  }
}
