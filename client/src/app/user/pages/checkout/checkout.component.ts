import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { selectUser } from '../../../+store/auth/selectors/auth.selectors';
import { AsyncPipe } from '@angular/common';
import { CheckoutAsideComponent } from './components/checkout-aside/checkout-aside.component';
import { CheckoutContactInfoComponent } from './components/checkout-contact-info/checkout-contact-info.component';
import { CheckoutLoginComponent } from './components/checkout-login/checkout-login.component';
import { CheckoutOrderListComponent } from './components/checkout-order-list/checkout-order-list.component';
import { CheckoutOrderRecipientComponent } from './components/checkout-order-recipient/checkout-order-recipient.component';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  CheckoutFormInterface,
  ContactInfoFormInterface,
  OrderedDeviceFormInterface,
  RecipientFormInterface,
} from '../../../shared/models/interfaces/checkout-form.interface';
import {
  emailPatternValidator,
  minMaxLengthValidator,
  namePatternValidator,
  phoneNumberValidator,
  requiredValidator,
} from '../../../shared/utils/validators';
import {
  REG_EMAIL,
  REG_NAME,
  REG_PHONE,
} from '../../../shared/models/constants/reg-exp-patterns';
import { SvgIconComponent } from 'angular-svg-icon';
import { CartDeviceInterface } from '../../../shared/models/interfaces/cart-device.interface';
import {
  selectAllCDevices,
  selectTotalPrice,
} from '../../../+store/cart/selectors/cart.selectors';

@Component({
  selector: 'app-checkout',
  imports: [
    AsyncPipe,
    CheckoutAsideComponent,
    CheckoutContactInfoComponent,
    CheckoutLoginComponent,
    CheckoutOrderListComponent,
    CheckoutOrderRecipientComponent,
    ReactiveFormsModule,
    SvgIconComponent,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent implements OnInit, OnDestroy {
  public user$!: Observable<UserInterface | null>;

  public totalPrice$!: Observable<number>;

  public devices$!: Observable<CartDeviceInterface[]>;

  public checkoutForm!: FormGroup<CheckoutFormInterface>;

  private store = inject(Store<State>);

  private fb = inject(FormBuilder);

  private destroy$: Subject<void> = new Subject<void>();

  public ngOnInit(): void {
    this.initForm(null, 0, []);
    this.user$ = this.store.select(selectUser);
    this.totalPrice$ = this.store.select(selectTotalPrice);
    this.devices$ = this.store.select(selectAllCDevices);
    combineLatest([this.user$, this.totalPrice$, this.devices$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([user, totalPrice, devices]) =>
        this.initForm(user, totalPrice, devices),
      );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public initForm(
    user: UserInterface | null,
    totalPrice: number,
    devices: CartDeviceInterface[],
  ): void {
    this.checkoutForm = this.fb.group<CheckoutFormInterface>({
      contactInfo: this.fb.group<ContactInfoFormInterface>({
        phone: this.fb.nonNullable.control<string>(user ? user.phone : '', [
          requiredValidator(),
          phoneNumberValidator(REG_PHONE),
        ]),
        email: this.fb.nonNullable.control<string>(user ? user.email : '', [
          requiredValidator(),
          emailPatternValidator(REG_EMAIL),
        ]),
        firstName: this.fb.nonNullable.control<string>(
          user ? user.firstName : '',
          [
            requiredValidator(),
            minMaxLengthValidator(3, null),
            namePatternValidator(REG_NAME),
          ],
        ),
        lastName: this.fb.nonNullable.control<string>(
          user ? user.lastName : '',
          [
            requiredValidator(),
            minMaxLengthValidator(3, null),
            namePatternValidator(REG_NAME),
          ],
        ),
      }),
      recipient: this.fb.group<RecipientFormInterface>({
        phone: this.fb.nonNullable.control<string>(user ? user.phone : '', [
          requiredValidator(),
          phoneNumberValidator(REG_PHONE),
        ]),
        firstName: this.fb.nonNullable.control<string>(
          user ? user.firstName : '',
          [
            requiredValidator(),
            minMaxLengthValidator(3, null),
            namePatternValidator(REG_NAME),
          ],
        ),
        lastName: this.fb.nonNullable.control<string>(
          user ? user.lastName : '',
          [
            requiredValidator(),
            minMaxLengthValidator(3, null),
            namePatternValidator(REG_NAME),
          ],
        ),
        patronymic: this.fb.nonNullable.control<string>(
          user ? user.patronymic : '',
          [],
        ),
      }),
      totalPrice: this.fb.nonNullable.control<number>(totalPrice),
      devices: this.fb.nonNullable.array<FormGroup<OrderedDeviceFormInterface>>(
        [],
      ),
    });
    for (const device of devices) {
      this.addDeviceCtrl(device);
    }
  }

  public createDeviceCtrl(
    device: CartDeviceInterface,
  ): FormGroup<OrderedDeviceFormInterface> {
    return this.fb.group({
      id: this.fb.nonNullable.control<string>(device.device.id),
      priceAtAdd: this.fb.nonNullable.control<number>(device.priceAtAdd),
      quantity: this.fb.nonNullable.control<number>(device.quantity),
    });
  }

  public getDevicesArrayCtrl(): FormArray<
    FormGroup<OrderedDeviceFormInterface>
  > {
    return this.checkoutForm.controls.devices;
  }

  public addDeviceCtrl(device: CartDeviceInterface): void {
    this.getDevicesArrayCtrl().push(this.createDeviceCtrl(device));
  }

  public createOrder(): void {
    console.log(this.checkoutForm.getRawValue());
  }
}
