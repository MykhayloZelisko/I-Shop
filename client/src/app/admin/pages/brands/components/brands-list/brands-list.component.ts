import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { BrandInterface } from '../../../../../shared/models/interfaces/brand.interface';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { selectAllBrands } from '../../../../../+store/brands/selectors/brand.selectors';
import { AsyncPipe } from '@angular/common';
import { BrandItemComponent } from './components/brand-item/brand-item.component';

@Component({
  selector: 'app-brands-list',
  standalone: true,
  imports: [AsyncPipe, BrandItemComponent],
  templateUrl: './brands-list.component.html',
  styleUrl: './brands-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandsListComponent implements OnInit {
  public brands$!: Observable<BrandInterface[]>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.brands$ = this.store.select(selectAllBrands);
  }
}
