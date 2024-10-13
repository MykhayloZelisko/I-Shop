import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { BreadcrumbsParamsInterface } from '../../models/interfaces/breadcrumbs-params.interface';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { selectBreadcrumbsParams } from '../../../+store/shared/selectors/shared.selectors';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [AsyncPipe, RouterLink, SvgIconComponent],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent implements OnInit {
  public breadcrumbsParams$!: Observable<BreadcrumbsParamsInterface | null>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.breadcrumbsParams$ = this.store.select(selectBreadcrumbsParams);
  }
}
