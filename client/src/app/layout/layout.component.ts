import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { Store } from '@ngrx/store';
import { State } from '../+store/reducers';
import { Observable } from 'rxjs';
import { PopupDataInterface } from '../shared/models/interfaces/popup-data.interface';
import { selectPopup } from '../+store/popup/selectors/popup.selectors';
import { AsyncPipe } from '@angular/common';
import { AuthDialogComponent } from './components/auth-dialog/auth-dialog.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { UserInterface } from '../shared/models/interfaces/user.interface';
import { PopupTypeEnum } from '../shared/models/enums/popup-type.enum';
import { selectAdmin, selectUser } from '../+store/auth/selectors/auth.selectors';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterOutlet,
    FooterComponent,
    AsyncPipe,
    AuthDialogComponent,
    MainMenuComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
  public readonly popupEnum = PopupTypeEnum;

  public popup$!: Observable<PopupDataInterface>;

  public user$!: Observable<UserInterface | null>;

  public isAdmin$!: Observable<boolean>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.popup$ = this.store.select(selectPopup);
    this.user$ = this.store.select(selectUser);
    this.isAdmin$ = this.store.select(selectAdmin);
  }
}
