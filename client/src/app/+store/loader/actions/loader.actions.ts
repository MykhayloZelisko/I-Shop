import { createActionGroup, emptyProps } from '@ngrx/store';

export const LoaderActions = createActionGroup({
  source: 'Loader',
  events: {
    ToggleLoader: emptyProps(),
  },
});
