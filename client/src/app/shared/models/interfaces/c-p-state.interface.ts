import { CurrentCategoryStatusInterface } from './current-category-status.interface';

export interface CPStateInterface {
  currentCategory: CurrentCategoryStatusInterface;
  isNewCategory: boolean;
  currentPropertyId: string | null;
}
