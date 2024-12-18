import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-device-carousel',
  standalone: true,
  imports: [SvgIconComponent, NgClass],
  templateUrl: './device-carousel.component.html',
  styleUrl: './device-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceCarouselComponent {
  public carousel = input.required<string[]>();

  public currentImageIndex = 0;

  public prevImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      this.currentImageIndex = this.carousel.length - 1;
    }
  }

  public nextImage(): void {
    if (this.currentImageIndex < this.carousel.length - 1) {
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0;
    }
  }

  public setCurrentIndex(index: number): void {
    this.currentImageIndex = index;
  }
}
