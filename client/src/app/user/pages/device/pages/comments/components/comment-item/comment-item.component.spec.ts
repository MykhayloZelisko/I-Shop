import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentItemComponent } from './comment-item.component';

describe('CommentItemComponent', () => {
  let component: CommentItemComponent;
  let fixture: ComponentFixture<CommentItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
