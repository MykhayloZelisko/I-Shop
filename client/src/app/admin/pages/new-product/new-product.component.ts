import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewProductComponent {

}
