import { CPropertiesGroupInterface } from './c-properties-group.interface';
import { CPropertyInterface } from './c-property.interface';

export interface GPInterface {
  groups: CPropertiesGroupInterface[];
  properties: CPropertyInterface[];
}
