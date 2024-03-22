import { createReducer, on } from '@ngrx/store';
import { MainMenuActions } from '../actions/main-menu.actions';

export const mainMenuFeatureKey = 'isOpenMainMenu';

export const initialState = false;

export const mainMenuReducer = createReducer(
  initialState,
  on(
    MainMenuActions.toggleMainMenu,
    (_state, action) => action.toggle === 'open',
  ),
);
