import { createActionGroup, emptyProps } from '@ngrx/store';

export const FormActions = createActionGroup({
  source: 'Form',
  events: {
    ClearFormsOn: emptyProps(),
    ClearFormsOff: emptyProps(),
  },
});
