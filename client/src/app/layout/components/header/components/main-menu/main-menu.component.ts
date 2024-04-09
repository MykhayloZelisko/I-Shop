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
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive';
import { DialogActions } from '../../../../../+store/dialog/actions/dialog.actions';
import { DialogTypeEnum } from '../../../../../shared/models/enums/dialog-type.enum';
import { UserRouteNameEnum } from '../../../../../shared/models/enums/user-route-name.enum';
import { LayoutRouteNameEnum } from '../../../../../shared/models/enums/layout-route-name.enum';
import { AuthActions } from '../../../../../+store/auth/actions/auth.actions';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [AsyncPipe, RouterLink, SvgIconComponent, ClickOutsideDirective],
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
      DialogActions.openDialog({
        dialog: {
          title: 'Вхід',
          dialogType: DialogTypeEnum.Login,
        },
      }),
    );
    this.closeMainMenu();
  }

  public registration(): void {
    this.store.dispatch(
      DialogActions.openDialog({
        dialog: {
          title: 'Реєстрація',
          dialogType: DialogTypeEnum.Registration,
        },
      }),
    );
    this.closeMainMenu();
  }

  public logout(): void {
    this.store.dispatch(AuthActions.logout());
    this.closeMainMenu();
  }

  public goAdmin(): void {
    this.router.navigateByUrl(LayoutRouteNameEnum.Admin);
    this.closeMainMenu();
  }
}
