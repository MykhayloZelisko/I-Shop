import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SvgFileControlComponent } from './svg-file-control.component';

describe('SvgFileControlComponent', () => {
  let component: SvgFileControlComponent;
  let fixture: ComponentFixture<SvgFileControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgFileControlComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgFileControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
