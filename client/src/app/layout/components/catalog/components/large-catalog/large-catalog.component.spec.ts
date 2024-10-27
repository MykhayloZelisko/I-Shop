import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LargeCatalogComponent } from './large-catalog.component';

describe('LargeCatalogComponent', () => {
  let component: LargeCatalogComponent;
  let fixture: ComponentFixture<LargeCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LargeCatalogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LargeCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
