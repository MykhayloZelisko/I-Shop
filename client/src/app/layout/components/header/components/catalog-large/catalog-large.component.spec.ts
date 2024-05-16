import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogLargeComponent } from './catalog-large.component';

describe('CatalogLargeComponent', () => {
  let component: CatalogLargeComponent;
  let fixture: ComponentFixture<CatalogLargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogLargeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CatalogLargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
