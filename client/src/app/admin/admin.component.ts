import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { ADMIN_MENU } from '../shared/models/constants/admin-menu';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, TabMenuModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  public readonly items: MenuItem[] = ADMIN_MENU;
}
