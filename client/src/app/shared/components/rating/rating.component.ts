import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingComponent {
  @Input({ required: true }) public rating!: number;

  @Input({ required: true }) public votes!: number;

  public svgGradient(rate: number): string {
    if (rate <= this.rating) {
      return '100%';
    } else if (rate > this.rating && rate < this.rating + 1) {
      return `${100 - (rate - this.rating) * 100}%`;
    } else {
      return '0%';
    }
  }
}
