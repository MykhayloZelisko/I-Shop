import { CreateCategoryInterface } from './create-category.interface';
import { CPropertiesGroupInterface } from './c-properties-group.interface';

export interface CategoryInterface extends CreateCategoryInterface {
  id: string;
  expanded?: boolean;
  groups: CPropertiesGroupInterface[];
}
