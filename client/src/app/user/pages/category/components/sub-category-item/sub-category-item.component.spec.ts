import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubCategoryItemComponent } from './sub-category-item.component';

describe('SubCategoryItemComponent', () => {
  let component: SubCategoryItemComponent;
  let fixture: ComponentFixture<SubCategoryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubCategoryItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubCategoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
