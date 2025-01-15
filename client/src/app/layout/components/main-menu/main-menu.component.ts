import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { AsyncPipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { PopupTypeEnum } from '../../../shared/models/enums/popup-type.enum';
import { UserRouteNameEnum } from '../../../shared/models/enums/user-route-name.enum';
import { LayoutRouteNameEnum } from '../../../shared/models/enums/layout-route-name.enum';
import { AuthActions } from '../../../+store/auth/actions/auth.actions';
import { PopupActions } from '../../../+store/popup/actions/popup.actions';
import { CartInfoInterface } from '../../../shared/models/interfaces/cart-info.interface';
import { selectCartInfo } from '../../../+store/cart/selectors/cart.selectors';

@Component({
  selector: 'app-main-menu',
  imports: [AsyncPipe, SvgIconComponent, ClickOutsideDirective, NgClass],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainMenuComponent implements OnInit {
  public user$ = input.required<Observable<UserInterface | null>>();

  public isAdmin$ = input.required<Observable<boolean>>();

  public cartInfo$!: Observable<CartInfoInterface>;

  private store = inject(Store<State>);

  private router = inject(Router);

  public ngOnInit(): void {
    this.cartInfo$ = this.store.select(selectCartInfo);
  }

  public closeMainMenu(): void {
    this.store.dispatch(PopupActions.closePopup());
  }

  public goHome(): void {
    this.router.navigateByUrl(UserRouteNameEnum.Home);
    this.closeMainMenu();
  }

  public login(): void {
    this.store.dispatch(
      PopupActions.openPopup({
        popup: {
          title: 'Вхід',
          popupType: PopupTypeEnum.Login,
        },
      }),
    );
  }

  public registration(): void {
    this.store.dispatch(
      PopupActions.openPopup({
        popup: {
          title: 'Реєстрація',
          popupType: PopupTypeEnum.Registration,
        },
      }),
    );
  }

  public logout(): void {
    this.store.dispatch(AuthActions.logout());
    this.closeMainMenu();
  }

  public goAdmin(): void {
    this.router.navigateByUrl(LayoutRouteNameEnum.Admin);
    this.closeMainMenu();
  }

  public openCatalog(): void {
    this.store.dispatch(
      PopupActions.openPopup({
        popup: {
          title: 'Каталог',
          popupType: PopupTypeEnum.Catalog,
        },
      }),
    );
  }

  public openCart(): void {
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
