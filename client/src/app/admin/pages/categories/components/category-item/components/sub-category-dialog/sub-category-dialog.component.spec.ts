import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoryDialogComponent } from './sub-category-dialog.component';

describe('SubCategoryDialogComponent', () => {
  let component: SubCategoryDialogComponent;
  let fixture: ComponentFixture<SubCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubCategoryDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
