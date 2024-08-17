import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { BrandInterface } from '../../../../../shared/models/interfaces/brand.interface';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { selectAllBrands } from '../../../../../+store/brands/selectors/brand.selectors';
import { AsyncPipe } from '@angular/common';
import { BrandItemComponent } from './components/brand-item/brand-item.component';
import { BrandActions } from '../../../../../+store/brands/actions/brand.actions';

@Component({
  selector: 'app-brands-list',
  standalone: true,
  imports: [AsyncPipe, BrandItemComponent],
  templateUrl: './brands-list.component.html',
  styleUrl: './brands-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandsListComponent implements OnInit, OnDestroy {
  public brands$!: Observable<BrandInterface[]>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.brands$ = this.store.select(selectAllBrands);
  }

  public ngOnDestroy(): void {
    this.store.dispatch(BrandActions.clearCurrentBrandId());
  }
}
