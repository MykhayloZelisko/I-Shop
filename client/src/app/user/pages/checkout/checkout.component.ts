import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
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
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  CheckoutFormInterface,
  ContactInfoFormInterface,
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
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent implements OnInit, OnDestroy {
  public user$!: Observable<UserInterface | null>;

  public checkoutForm!: FormGroup<CheckoutFormInterface>;

  private store = inject(Store<State>);

  private fb = inject(FormBuilder);

  private destroy$: Subject<void> = new Subject<void>();

  public ngOnInit(): void {
    this.initForm(null);
    this.user$ = this.store.select(selectUser).pipe(
      takeUntil(this.destroy$),
      tap((user) => this.initForm(user)),
    );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public initForm(user: UserInterface | null): void {
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
        patronymic: this.fb.nonNullable.control<string>('', []),
      }),
    });
  }
}
