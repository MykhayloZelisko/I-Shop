import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutAsideComponent } from './checkout-aside.component';

describe('CheckoutAsideComponent', () => {
  let component: CheckoutAsideComponent;
  let fixture: ComponentFixture<CheckoutAsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutAsideComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
