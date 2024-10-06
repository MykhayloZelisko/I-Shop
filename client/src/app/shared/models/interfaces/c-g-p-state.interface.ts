import { CurrentStatusInterface } from './current-status.interface';

export interface CGPStateInterface {
  currentCategory: CurrentStatusInterface;
  currentGroup: CurrentStatusInterface;
  isNewCategory: boolean;
  currentPropertyId: string | null;
}
