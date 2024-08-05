import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallCatalogComponent } from './small-catalog.component';

describe('SmallCatalogComponent', () => {
  let component: SmallCatalogComponent;
  let fixture: ComponentFixture<SmallCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmallCatalogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SmallCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
