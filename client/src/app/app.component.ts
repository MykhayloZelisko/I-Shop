import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from './+store/reducers';
import { GetMeActions } from './+store/user/actions/get-me.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.store.dispatch(GetMeActions.getMe());
  }
}
