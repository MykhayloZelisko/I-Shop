import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutListItemComponent } from './checkout-list-item.component';

describe('CheckoutListItemComponent', () => {
  let component: CheckoutListItemComponent;
  let fixture: ComponentFixture<CheckoutListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
