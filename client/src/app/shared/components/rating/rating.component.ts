import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { RouterLink } from '@angular/router';
import { v4 as uuidV4 } from 'uuid';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [SvgIconComponent, RouterLink, NgClass],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingComponent implements OnInit {
  @Input({ required: true }) public rating!: number;

  @Input() public votes!: number;

  @Input({ required: true }) public deviceId!: string;

  public idArray: string[] = [];

  public ngOnInit(): void {
    for (let i = 0; i < 5; i++) {
      this.idArray.push(uuidV4());
    }
  }

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
