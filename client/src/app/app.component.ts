import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from './+store/reducers';
import { AuthActions } from './+store/auth/actions/auth.actions';
import { CategoryActions } from './+store/categories/actions/category.actions';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { isPlatformBrowser } from '@angular/common';
import { CartActions } from './+store/cart/actions/cart.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private store = inject(Store<State>);

  private platformId = inject(PLATFORM_ID);

  public constructor() {
    afterNextRender(() => {
      this.store.dispatch(AuthActions.getMe());
      // if (isPlatformBrowser(this.platformId)) {
      //   const id = localStorage.getItem('cartId');
      //   if (id) {
      //     this.store.dispatch(CartActions.loadCart({ id }));
      //   }
      // }
    });
  }

  public ngOnInit(): void {
    this.store.dispatch(CategoryActions.loadCategories());
  }
}
