import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutLoginComponent } from './checkout-login.component';

describe('CheckoutLoginComponent', () => {
  let component: CheckoutLoginComponent;
  let fixture: ComponentFixture<CheckoutLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutLoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
