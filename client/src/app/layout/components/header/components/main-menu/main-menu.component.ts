import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { Observable } from 'rxjs';
import { UserInterface } from '../../../../../shared/models/interfaces/user.interface';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { MainMenuActions } from '../../../../../+store/main-menu/actions/main-menu.actions';
import { MainMenuClickOutsideDirective } from './directives/main-menu-click-outside.directive';
import { AuthDialogActions } from '../../../../../+store/auth-dialog/actions/auth-dialog.actions';
import { AuthDialogTypeEnum } from '../../../../../shared/models/enums/auth-dialog-type.enum';
import { LogoutActions } from '../../../../../+store/user/actions/logout.actions';
import { UserRouteNameEnum } from '../../../../../shared/models/enums/user-route-name.enum';
import { LayoutRouteNameEnum } from '../../../../../shared/models/enums/layout-route-name.enum';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    SvgIconComponent,
    MainMenuClickOutsideDirective,
  ],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainMenuComponent {
  @Input({ required: true }) public user$!: Observable<UserInterface | null>;

  @Input({ required: true }) public isAdmin$!: Observable<boolean>;

  private store = inject(Store<State>);

  private router = inject(Router);

  public closeMainMenu(): void {
    this.store.dispatch(MainMenuActions.toggleMainMenu({ toggle: 'close' }));
  }

  public goHome(): void {
    this.router.navigateByUrl(UserRouteNameEnum.Home);
    this.closeMainMenu();
  }

  public login(): void {
    this.store.dispatch(
      AuthDialogActions.authDialog({
        dialog: {
          title: 'Вхід',
          dialogType: AuthDialogTypeEnum.Login,
        },
      }),
    );
    this.closeMainMenu();
  }

  public registration(): void {
    this.store.dispatch(
      AuthDialogActions.authDialog({
        dialog: {
          title: 'Реєстрація',
          dialogType: AuthDialogTypeEnum.Registration,
        },
      }),
    );
    this.closeMainMenu();
  }

  public logout(): void {
    this.store.dispatch(LogoutActions.logout());
    this.closeMainMenu();
  }

  public goAdmin(): void {
    this.router.navigateByUrl(LayoutRouteNameEnum.Admin);
    this.closeMainMenu();
  }
}
