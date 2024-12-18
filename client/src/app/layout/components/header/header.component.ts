import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { SvgIconComponent } from 'angular-svg-icon';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { PopupTypeEnum } from '../../../shared/models/enums/popup-type.enum';
import { LayoutRouteNameEnum } from '../../../shared/models/enums/layout-route-name.enum';
import { PopupActions } from '../../../+store/popup/actions/popup.actions';
import { PopupDataInterface } from '../../../shared/models/interfaces/popup-data.interface';
import { selectPopup } from '../../../+store/popup/selectors/popup.selectors';
import { SharedActions } from '../../../+store/shared/actions/shared.actions';
import { BrandActions } from '../../../+store/brands/actions/brand.actions';
import { CartInfoInterface } from '../../../shared/models/interfaces/cart-info.interface';
import { selectCartInfo } from '../../../+store/cart/selectors/cart.selectors';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SvgIconComponent, RouterLink, AsyncPipe, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  public user$ = input.required<Observable<UserInterface | null>>();

  public isAdmin$ = input.required<Observable<boolean>>();

  public readonly popupType = PopupTypeEnum;

  public popup$!: Observable<PopupDataInterface>;

  public cartInfo$!: Observable<CartInfoInterface>;

  private store = inject(Store<State>);

  private router = inject(Router);

  public ngOnInit(): void {
    this.popup$ = this.store.select(selectPopup);
    this.cartInfo$ = this.store.select(selectCartInfo);
  }

  public login(event: MouseEvent): void {
    event.stopPropagation();
    this.store.dispatch(
      PopupActions.openPopup({
        popup: {
          title: 'Вхід',
          popupType: PopupTypeEnum.Login,
        },
      }),
    );
  }

  public openMainMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.store.dispatch(
      PopupActions.openPopup({
        popup: {
          title: '',
          popupType: PopupTypeEnum.MainMenu,
        },
      }),
    );
    this.store.dispatch(SharedActions.clearCGPState());
    this.store.dispatch(BrandActions.clearCurrentBrandId());
  }

  public goAdmin(): void {
    this.router.navigateByUrl(LayoutRouteNameEnum.Admin);
  }

  public closeCatalog(): void {
    this.store.dispatch(PopupActions.closePopup());
  }

  public openCatalog(event: MouseEvent): void {
    event.stopPropagation();
    this.store.dispatch(
      PopupActions.openPopup({
        popup: {
          title: 'Каталог',
          popupType: PopupTypeEnum.Catalog,
        },
      }),
    );
    this.store.dispatch(SharedActions.clearCGPState());
    this.store.dispatch(BrandActions.clearCurrentBrandId());
  }

  public clearState(): void {
    this.store.dispatch(PopupActions.closePopup());
    this.store.dispatch(SharedActions.clearCGPState());
    this.store.dispatch(BrandActions.clearCurrentBrandId());
  }

  public openCart(event: MouseEvent): void {
    event.stopPropagation();
    this.store.dispatch(SharedActions.clearCGPState());
    this.store.dispatch(BrandActions.clearCurrentBrandId());
    this.store.dispatch(
      PopupActions.openPopup({
        popup: {
          title: 'Кошик',
          popupType: PopupTypeEnum.Cart,
        },
      }),
    );
  }
}
