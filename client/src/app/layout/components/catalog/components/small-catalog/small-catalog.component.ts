import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-small-catalog',
  standalone: true,
  imports: [],
  templateUrl: './small-catalog.component.html',
  styleUrl: './small-catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmallCatalogComponent {

}
