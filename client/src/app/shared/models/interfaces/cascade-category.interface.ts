import { CategoryInterface } from './category.interface';

export interface CascadeCategoryInterface extends CategoryInterface {
  children: CascadeCategoryInterface[];
}
