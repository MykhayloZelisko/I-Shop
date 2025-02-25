import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutContactInfoComponent } from './checkout-contact-info.component';

describe('CheckoutContactInfoComponent', () => {
  let component: CheckoutContactInfoComponent;
  let fixture: ComponentFixture<CheckoutContactInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutContactInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutContactInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
