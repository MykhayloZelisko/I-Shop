import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Apollo } from 'apollo-angular';
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
  public users: unknown;

  public constructor(
    private apollo: Apollo,
    private cdr: ChangeDetectorRef,
    private store: Store<State>,
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(GetMeActions.getMe());
  }
}
