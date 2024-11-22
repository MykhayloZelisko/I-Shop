import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { PopupDataInterface } from '../../../shared/models/interfaces/popup-data.interface';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { PopupActions } from '../../../+store/popup/actions/popup.actions';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { CheckboxComponent } from '../../../shared/components/checkbox/checkbox.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  selectAllCDevices,
  selectCartId,
  selectIdsCDevices,
  selectOrderedItemsCount,
  selectTotalCDevices,
  selectTotalPrice,
} from '../../../+store/cart/selectors/cart.selectors';
import { AsyncPipe } from '@angular/common';
import { CartDeviceInterface } from '../../../shared/models/interfaces/cart-device.interface';
import { CartDeviceComponent } from './components/cart-device/cart-device.component';
import { CartActions } from '../../../+store/cart/actions/cart.actions';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    ClickOutsideDirective,
    CheckboxComponent,
    SvgIconComponent,
    ReactiveFormsModule,
    AsyncPipe,
    CartDeviceComponent,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent implements OnInit, OnDestroy {
  @Input({ required: true }) public dialog!: PopupDataInterface;

  public totalCount$!: Observable<number>;

  public orderedCount$!: Observable<number>;

  public totalPrice$!: Observable<number>;

  public devices$!: Observable<CartDeviceInterface[]>;

  public devicesIds$!: Observable<string[] | number[]>;

  public cartId$!: Observable<string | null>;

  public selectAllCtrl!: FormControl<boolean | null>;

  private destroy$: Subject<void> = new Subject<void>();

  private store = inject(Store<State>);

  private fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.selectAllCtrl = this.fb.control<boolean | null>(null);
    this.totalCount$ = this.store.select(selectTotalCDevices);
    this.orderedCount$ = this.store.select(selectOrderedItemsCount);
    this.devices$ = this.store.select(selectAllCDevices);
    this.devicesIds$ = this.store.select(selectIdsCDevices);
    this.totalPrice$ = this.store.select(selectTotalPrice);
    this.cartId$ = this.store.select(selectCartId);
    this.initCounter();
    this.updateAll();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public initCounter(): void {
    combineLatest([this.totalCount$, this.orderedCount$])
      .pipe(
        map(([totalCount, orderedCount]) =>
          totalCount > 0 && totalCount === orderedCount
            ? true
            : orderedCount === 0
              ? false
              : null,
        ),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (checkboxState: boolean | null) => {
          this.selectAllCtrl.setValue(checkboxState, { emitEvent: false });
        },
      });
  }

  public closeDialog(): void {
    this.store.dispatch(PopupActions.closePopup());
  }

  public deleteDevices(devices: CartDeviceInterface[]): void {
    const deviceIds = devices
      .filter((device: CartDeviceInterface) => device.isInOrder)
      .map((device: CartDeviceInterface) => device.id);

    this.cartId$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (cartId: string | null) => {
        if (cartId) {
          this.store.dispatch(
            CartActions.deleteCartDevices({ deviceIds, cartId }),
          );
        }
      },
    });
  }

  public updateAll(): void {
    const ctrlValue$ = this.selectAllCtrl.valueChanges;
    combineLatest([ctrlValue$, this.devicesIds$])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([value, ids]) => {
          const isInOrder = value ?? false;
          this.store.dispatch(
            CartActions.updateCartDevices({
              payload: { ids: ids as string[], isInOrder },
            }),
          );
        },
      });
  }
}
