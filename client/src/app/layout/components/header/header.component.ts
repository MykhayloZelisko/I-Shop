import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { SvgIconComponent } from 'angular-svg-icon';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PopupTypeEnum } from '../../../shared/models/enums/popup-type.enum';
import { LayoutRouteNameEnum } from '../../../shared/models/enums/layout-route-name.enum';
import { PopupActions } from '../../../+store/popup/actions/popup.actions';
import { PopupDataInterface } from '../../../shared/models/interfaces/popup-data.interface';
import { selectPopup } from '../../../+store/popup/selectors/popup.selectors';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SvgIconComponent, RouterLink, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  @Input({ required: true }) public user$!: Observable<UserInterface | null>;

  @Input({ required: true }) public isAdmin$!: Observable<boolean>;

  public readonly popupType = PopupTypeEnum;

  public popup$!: Observable<PopupDataInterface>;

  private store = inject(Store<State>);

  private router = inject(Router);

  public ngOnInit(): void {
    this.popup$ = this.store.select(selectPopup);
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
  }
}
