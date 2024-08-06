import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSubCategoryComponent } from './sub-sub-category.component';

describe('SubSubCategoryComponent', () => {
  let component: SubSubCategoryComponent;
  let fixture: ComponentFixture<SubSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubSubCategoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
