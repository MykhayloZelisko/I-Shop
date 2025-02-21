import { Directive, HostBinding, HostListener, output } from '@angular/core';

@Directive({
  selector: '[appDnd]',
})
export class DndDirective {
  public fileDropped = output<FileList>();

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
