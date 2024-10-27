import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceAsideComponent } from './device-aside.component';

describe('DeviceAsideComponent', () => {
  let component: DeviceAsideComponent;
  let fixture: ComponentFixture<DeviceAsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceAsideComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
