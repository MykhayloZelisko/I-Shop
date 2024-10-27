import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CPropertiesGroupsDialogComponent } from './c-properties-groups-dialog.component';

describe('CPropertiesGroupsDialogComponent', () => {
  let component: CPropertiesGroupsDialogComponent;
  let fixture: ComponentFixture<CPropertiesGroupsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CPropertiesGroupsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CPropertiesGroupsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
