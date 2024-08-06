import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreCategoryComponent } from './core-category.component';

describe('CoreCategoryComponent', () => {
  let component: CoreCategoryComponent;
  let fixture: ComponentFixture<CoreCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreCategoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoreCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
