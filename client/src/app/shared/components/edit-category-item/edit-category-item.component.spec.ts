import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCategoryItemComponent } from './edit-category-item.component';

describe('EditCategoryItemComponent', () => {
  let component: EditCategoryItemComponent;
  let fixture: ComponentFixture<EditCategoryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCategoryItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCategoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
