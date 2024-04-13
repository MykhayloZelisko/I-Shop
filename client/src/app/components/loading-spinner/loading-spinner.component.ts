import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { selectLoader } from '../../+store/loader/selectors/loader.selectors';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../+store/reducers';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent implements OnInit {
  public loader$!: Observable<boolean>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.loader$ = this.store.select(selectLoader);
  }
}
