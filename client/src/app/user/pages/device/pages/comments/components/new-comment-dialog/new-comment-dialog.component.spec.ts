import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCommentDialogComponent } from './new-comment-dialog.component';

describe('NewCommentComponent', () => {
  let component: NewCommentDialogComponent;
  let fixture: ComponentFixture<NewCommentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCommentDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewCommentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
