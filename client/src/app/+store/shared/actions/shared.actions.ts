import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CGPStateInterface } from '../../../shared/models/interfaces/c-g-p-state.interface';
import { GPInterface } from '../../../shared/models/interfaces/g-p.interface';

export const SharedActions = createActionGroup({
  source: 'Shared',
  events: {
    UpdateCGPState: props<{ payload: CGPStateInterface }>(),
    ClearCGPState: emptyProps(),
    AddGroupsWithProperties: props<{ id: string }>(),
    AddGroupsWithPropertiesSuccess: props<{ payload: GPInterface }>(),
    AddGroupsWithPropertiesFailure: emptyProps(),
  },
});
