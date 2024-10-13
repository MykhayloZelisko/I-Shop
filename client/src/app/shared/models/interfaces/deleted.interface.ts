import { CPropertiesGroupInterface } from './c-properties-group.interface';
import { CategoryInterface } from './category.interface';

export interface DeletedInterface {
  categoriesIds: string[];
  groupsIds: string[];
  propertiesIds: string[];
  group: CPropertiesGroupInterface | null;
  category: CategoryInterface | null;
}
