import { CPropertiesGroupInterface } from './c-properties-group.interface';
import { CPropertyInterface } from './c-property.interface';

export interface GPTreeInterface extends CPropertiesGroupInterface {
  properties: CPropertyInterface[];
}
