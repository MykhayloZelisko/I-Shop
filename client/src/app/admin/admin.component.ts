import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { ADMIN_MENU } from '../shared/models/constants/admin-menu';
import { State } from '../+store/reducers';
import { Store } from '@ngrx/store';
import { BrandActions } from '../+store/brands/actions/brand.actions';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, TabMenuModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent implements OnInit {
  public readonly items: MenuItem[] = ADMIN_MENU;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.store.dispatch(BrandActions.loadBrands());
  }
}
