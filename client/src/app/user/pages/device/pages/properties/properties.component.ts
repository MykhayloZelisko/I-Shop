import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { DeviceInterface } from '../../../../../shared/models/interfaces/device.interface';
import { Store } from '@ngrx/store';
import { State } from '../../../../../+store/reducers';
import { selectDevice } from '../../../../../+store/devices/selectors/device.selectors';
import { AsyncPipe } from '@angular/common';
import { RatingComponent } from '../../../../../shared/components/rating/rating.component';
import { PropertiesListComponent } from './components/properties-list/properties-list.component';
import { DeviceAsideComponent } from '../../../../../shared/components/device-aside/device-aside.component';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [
    AsyncPipe,
    RatingComponent,
    PropertiesListComponent,
    DeviceAsideComponent,
  ],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertiesComponent implements OnInit {
  public device$!: Observable<DeviceInterface | null>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.device$ = this.store.select(selectDevice);
  }
}
