import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CPropertiesGroupItemComponent } from './c-properties-group-item.component';

describe('CPropertiesGroupItemComponent', () => {
  let component: CPropertiesGroupItemComponent;
  let fixture: ComponentFixture<CPropertiesGroupItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CPropertiesGroupItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CPropertiesGroupItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
