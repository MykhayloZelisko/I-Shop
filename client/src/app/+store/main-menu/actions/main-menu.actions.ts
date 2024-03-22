import { createActionGroup, props } from '@ngrx/store';

export const MainMenuActions = createActionGroup({
  source: 'MainMenu',
  events: {
    ToggleMainMenu: props<{ toggle: 'open' | 'close' }>(),
  },
});
