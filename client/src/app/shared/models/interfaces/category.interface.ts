import { CreateCategoryInterface } from './create-category.interface';

export interface CategoryInterface extends CreateCategoryInterface {
  id: string;
  hasGroups: boolean;
  expanded?: boolean;
  loadedGroups?: boolean;
}
