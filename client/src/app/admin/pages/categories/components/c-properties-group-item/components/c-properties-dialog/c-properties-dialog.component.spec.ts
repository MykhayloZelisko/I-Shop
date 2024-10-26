import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CPropertiesDialogComponent } from './c-properties-dialog.component';

describe('CPropertiesDialogComponent', () => {
  let component: CPropertiesDialogComponent;
  let fixture: ComponentFixture<CPropertiesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CPropertiesDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CPropertiesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
