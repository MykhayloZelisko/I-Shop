import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentMenuComponent } from './comment-menu.component';

describe('CommentMenuComponent', () => {
  let component: CommentMenuComponent;
  let fixture: ComponentFixture<CommentMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
