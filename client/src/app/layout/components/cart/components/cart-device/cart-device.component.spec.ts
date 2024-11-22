import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartDeviceComponent } from './cart-device.component';

describe('CartDeviceComponent', () => {
  let component: CartDeviceComponent;
  let fixture: ComponentFixture<CartDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartDeviceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
