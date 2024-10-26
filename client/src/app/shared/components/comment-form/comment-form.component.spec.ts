import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCommentFormComponent } from './comment-form.component';

describe('NewCommentFormComponent', () => {
  let component: NewCommentFormComponent;
  let fixture: ComponentFixture<NewCommentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCommentFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewCommentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
