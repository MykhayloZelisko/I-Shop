import { CPropertyInterface } from './c-property.interface';

export interface CategoryInterface {
  id: string;
  categoryName: string;
  parentId: string | null;
  image: string | null;
  expanded?: boolean;
  properties: CPropertyInterface[];
}
