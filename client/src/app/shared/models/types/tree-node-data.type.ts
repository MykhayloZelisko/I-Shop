import { CategoryInterface } from '../interfaces/category.interface';
import { CPropertyInterface } from '../interfaces/c-property.interface';
import { CPropertiesGroupInterface } from '../interfaces/c-properties-group.interface';

export type TreeNodeDataType =
  | CategoryInterface
  | CPropertyInterface
  | CPropertiesGroupInterface;
