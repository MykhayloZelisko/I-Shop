import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutOrderRecipientComponent } from './checkout-order-recipient.component';

describe('CheckoutOrderRecipientComponent', () => {
  let component: CheckoutOrderRecipientComponent;
  let fixture: ComponentFixture<CheckoutOrderRecipientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutOrderRecipientComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutOrderRecipientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
