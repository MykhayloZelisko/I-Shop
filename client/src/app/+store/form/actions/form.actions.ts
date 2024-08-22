import { createActionGroup, emptyProps } from '@ngrx/store';

export const FormActions = createActionGroup({
  source: 'Form',
  events: {
    ClearFormOn: emptyProps(),
    ClearFormOff: emptyProps(),
  },
});
