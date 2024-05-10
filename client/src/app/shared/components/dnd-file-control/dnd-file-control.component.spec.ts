import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DndFileControlComponent } from './dnd-file-control.component';

describe('DndFileControlComponent', () => {
  let component: DndFileControlComponent;
  let fixture: ComponentFixture<DndFileControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DndFileControlComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DndFileControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
