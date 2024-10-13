import { CreateCPropertiesGroupInterface } from './create-c-properties-group.interface';

export interface CPropertiesGroupInterface
  extends CreateCPropertiesGroupInterface {
  id: string;
  expanded?: boolean;
  loadedProperties?: boolean;
  hasProperties: boolean;
}
