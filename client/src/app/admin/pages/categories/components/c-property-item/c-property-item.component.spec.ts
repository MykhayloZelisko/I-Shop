import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CPropertyItemComponent } from './c-property-item.component';

describe('CPropertyItemComponent', () => {
  let component: CPropertyItemComponent;
  let fixture: ComponentFixture<CPropertyItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CPropertyItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CPropertyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
