import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesAsideComponent } from './properties-aside.component';

describe('PropertiesAsideComponent', () => {
  let component: PropertiesAsideComponent;
  let fixture: ComponentFixture<PropertiesAsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertiesAsideComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertiesAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
