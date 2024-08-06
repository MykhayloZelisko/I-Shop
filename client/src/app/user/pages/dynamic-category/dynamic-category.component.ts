import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CoreCategoryComponent } from './pages/core-category/core-category.component';
import { SubCategoryComponent } from './pages/sub-category/sub-category.component';
import { SubSubCategoryComponent } from './pages/sub-sub-category/sub-sub-category.component';
import { AsyncPipe } from '@angular/common';
import { Observable, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { selectCategoryLevel } from '../../../+store/categories/selectors/category.selectors';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

@Component({
  selector: 'app-dynamic-category',
  standalone: true,
  imports: [
    CoreCategoryComponent,
    SubCategoryComponent,
    SubSubCategoryComponent,
    AsyncPipe,
    PageNotFoundComponent,
  ],
  templateUrl: './dynamic-category.component.html',
  styleUrl: './dynamic-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicCategoryComponent implements OnInit {
  public categoryLevel$!: Observable<number>;

  private route = inject(ActivatedRoute);

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.categoryLevel$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const categoryId = params.get('id') ?? '';
        return this.store.select(selectCategoryLevel(categoryId));
      }),
    );
  }
}
