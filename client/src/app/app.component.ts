import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from './+store/reducers';
import { AuthActions } from './+store/auth/actions/auth.actions';
import { CategoryActions } from './+store/categories/actions/category.actions';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoadingSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.store.dispatch(AuthActions.getMe());
    this.store.dispatch(CategoryActions.loadCategories());
  }
}
