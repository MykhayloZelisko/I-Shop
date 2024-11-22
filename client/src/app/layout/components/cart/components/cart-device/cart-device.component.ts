import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { CartDeviceInterface } from '../../../../../shared/models/interfaces/cart-device.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CartDeviceFormInterface } from '../../../../../shared/models/interfaces/cart-device-form.interface';
import { CheckboxComponent } from '../../../../../shared/components/checkbox/checkbox.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { NgxMaskDirective } from 'ngx-mask';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { PopupActions } from '../../../../../+store/popup/actions/popup.actions';
import { Observable, take } from 'rxjs';
import { CartActions } from '../../../../../+store/cart/actions/cart.actions';

@Component({
  selector: 'app-cart-device',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckboxComponent,
    SvgIconComponent,
    NgxMaskDirective,
  ],
  templateUrl: './cart-device.component.html',
  styleUrl: './cart-device.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartDeviceComponent implements OnInit {
  @Input({ required: true }) public device!: CartDeviceInterface;

  @Input({ required: true }) public cartId$!: Observable<string | null>;

  public cartDeviceForm!: FormGroup<CartDeviceFormInterface>;

  private fb = inject(FormBuilder);

  private router = inject(Router);

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.initForm();
  }

  public initForm(): void {
    this.cartDeviceForm = this.fb.group<CartDeviceFormInterface>({
      quantity: this.fb.nonNullable.control<number>(this.device.quantity),
      isInOrder: this.fb.nonNullable.control<boolean>(this.device.isInOrder),
    });
  }

  public onInput(): void {
    const maxQuantity = this.device.device.quantity;
    const control = this.cartDeviceForm.controls.quantity;
    if (control) {
      const value = control.value;
      if (!value) {
        control.setValue(1);
      }
      if (value > maxQuantity) {
        control.setValue(maxQuantity);
      }
    }
    this.submitData();
  }

  public redirectToDevice(event: MouseEvent): void {
    event.preventDefault();
    this.router.navigate(['devices', this.device.device.id]);
    this.store.dispatch(PopupActions.closePopup());
  }

  public deleteDevice(): void {
    this.cartId$.pipe(take(1)).subscribe({
      next: (id: string | null) => {
        if (id) {
          this.store.dispatch(
            CartActions.deleteCartDevices({
              deviceIds: [this.device.id],
              cartId: id,
            }),
          );
        }
      },
    });
  }

  public changeQuantity(value: 1 | -1): void {
    const control = this.cartDeviceForm.controls.quantity;
    control.setValue(control.value + value);
    this.submitData();
  }

  public submitData(): void {
    const device = this.cartDeviceForm.getRawValue();
    this.store.dispatch(
      CartActions.updateCartDevice({ id: this.device.id, device }),
    );
  }
}
