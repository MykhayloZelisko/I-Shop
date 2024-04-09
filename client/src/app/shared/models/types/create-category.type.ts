import { CategoryInterface } from '../interfaces/category.interface';

export type CreateCategoryType = Omit<CategoryInterface, 'id'>;
