import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import {
  selectAdmin,
  selectUser,
} from '../../../+store/user/selectors/user.selectors';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { SvgIconComponent } from 'angular-svg-icon';
import { Router, RouterLink } from '@angular/router';
import { AuthDialogComponent } from './components/auth-dialog/auth-dialog.component';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AuthDialogDataInterface } from '../../../shared/models/interfaces/auth-dialog-data.interface';
import { selectAuthDialog } from '../../../+store/auth-dialog/selectors/auth-dialog.selectors';
import { AuthDialogActions } from '../../../+store/auth-dialog/actions/auth-dialog.actions';
import { AuthDialogTypeEnum } from '../../../shared/models/enums/auth-dialog-type.enum';
import { selectMainMenu } from '../../../+store/main-menu/selectors/main-menu.selectors';
import { MainMenuActions } from '../../../+store/main-menu/actions/main-menu.actions';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { LayoutRouteNameEnum } from '../../../shared/models/enums/layout-route-name.enum';
import { MainMenuInterface } from '../../../shared/models/interfaces/main-menu.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    SvgIconComponent,
    RouterLink,
    AuthDialogComponent,
    AsyncPipe,
    MainMenuComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  public readonly authDialogEnum = AuthDialogTypeEnum;

  public user$!: Observable<UserInterface | null>;

  public isAdmin$!: Observable<boolean>;

  public dialog$!: Observable<AuthDialogDataInterface>;

  public mainMenu$!: Observable<MainMenuInterface>;

  private store = inject(Store<State>);

  private router = inject(Router);

  public ngOnInit(): void {
    this.user$ = this.store.select(selectUser);
    this.isAdmin$ = this.store.select(selectAdmin);
    this.dialog$ = this.store.select(selectAuthDialog);
    this.mainMenu$ = this.store.select(selectMainMenu);
  }

  public openDialog(): void {
    this.store.dispatch(
      AuthDialogActions.authDialog({
        dialog: {
          title: 'Вхід',
          dialogType: AuthDialogTypeEnum.Login,
        },
      }),
    );
  }

  public openMainMenu(): void {
    this.store.dispatch(MainMenuActions.toggleMainMenu({ toggle: 'open' }));
  }

  public goAdmin(): void {
    this.router.navigateByUrl(LayoutRouteNameEnum.Admin);
  }
}
