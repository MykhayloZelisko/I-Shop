import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceCarouselComponent } from './device-carousel.component';

describe('DeviceCarouselComponent', () => {
  let component: DeviceCarouselComponent;
  let fixture: ComponentFixture<DeviceCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceCarouselComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
