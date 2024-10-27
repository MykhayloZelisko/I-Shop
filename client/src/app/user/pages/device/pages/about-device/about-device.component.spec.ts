import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutDeviceComponent } from './about-device.component';

describe('AboutDeviceComponent', () => {
  let component: AboutDeviceComponent;
  let fixture: ComponentFixture<AboutDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutDeviceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
