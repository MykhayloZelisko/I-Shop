import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appDnd]',
  standalone: true,
})
export class DndDirective {
  @Output() public fileDropped: EventEmitter<FileList> =
    new EventEmitter<FileList>();

  @HostBinding('class.drag-over') private isDragOver = false;

  @HostListener('dragover', ['$event'])
  private onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  @HostListener('dragleave', ['$event'])
  private onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  @HostListener('drop', ['$event'])
  private onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;

    if (files) {
      this.fileDropped.emit(files);
    }
  }
}
