import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubCategoriesDialogComponent } from './sub-categories-dialog.component';

describe('SubCategoryDialogComponent', () => {
  let component: SubCategoriesDialogComponent;
  let fixture: ComponentFixture<SubCategoriesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubCategoriesDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubCategoriesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
