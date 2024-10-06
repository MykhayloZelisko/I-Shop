import { CPropertyInterface } from './c-property.interface';
import { CreateCPropertiesGroupInterface } from './create-c-properties-group.interface';

export interface CPropertiesGroupInterface
  extends CreateCPropertiesGroupInterface {
  id: string;
  properties: CPropertyInterface[];
}
