import { CategoryInterface } from './category.interface';

export interface CategoriesTreeInterface extends CategoryInterface {
  children: CategoriesTreeInterface[];
}
