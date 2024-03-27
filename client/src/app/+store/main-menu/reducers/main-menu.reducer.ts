import { createReducer, on } from '@ngrx/store';
import { MainMenuActions } from '../actions/main-menu.actions';

export const mainMenuFeatureKey = 'mainMenu';

export interface State {
  isOpen: boolean;
}

export const initialState: State = {
  isOpen: false,
};

export const reducer = createReducer(
  initialState,
  on(MainMenuActions.toggleMainMenu, (state, action) => ({
    ...state,
    isOpen: action.toggle === 'open',
  })),
);
