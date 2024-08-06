import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicCategoryComponent } from './dynamic-category.component';

describe('DynamicCategoryComponent', () => {
  let component: DynamicCategoryComponent;
  let fixture: ComponentFixture<DynamicCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicCategoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
