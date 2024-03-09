import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { userSelector } from '../../../+store/user/selectors/user.selectors';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';
import { RoleInterface } from '../../../shared/models/interfaces/role.interface';
import { SvgIconComponent } from 'angular-svg-icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SvgIconComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  public user!: UserInterface;

  public isAdmin = false;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.store.select(userSelector).subscribe((user: UserInterface) => {
      this.user = user;
      this.isAdmin = user
        ? user.roles.some(
            (role: RoleInterface) => role.role === 'administrator',
          )
        : false;
    });
  }
}
