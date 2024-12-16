import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Tab, TabList, Tabs } from 'primeng/tabs';
import { TabMenuItemInterface } from '../../models/interfaces/tab-menu-item.interface';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../../+store/reducers';
import { selectActiveRouteLastPart } from '../../../+store/router/selectors/router.selectors';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tab-menu',
  imports: [AsyncPipe, Tab, TabList, Tabs, RouterLink],
  templateUrl: './tab-menu.component.html',
  styleUrl: './tab-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabMenuComponent implements OnInit {
  @Input({ required: true }) public items!: TabMenuItemInterface[];

  public activeTab$!: Observable<string | undefined>;

  private store = inject(Store<State>);

  public ngOnInit(): void {
    this.activeTab$ = this.store.select(selectActiveRouteLastPart);
  }
}
