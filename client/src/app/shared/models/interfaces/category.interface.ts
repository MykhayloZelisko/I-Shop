import { CPropertyInterface } from './c-property.interface';
import { CreateCategoryInterface } from './create-category.interface';

export interface CategoryInterface extends CreateCategoryInterface {
  id: string;
  expanded?: boolean;
  properties: CPropertyInterface[];
}
