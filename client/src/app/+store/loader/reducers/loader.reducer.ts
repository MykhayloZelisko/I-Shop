import { createReducer, on } from '@ngrx/store';
import { LoaderActions } from '../actions/loader.actions';

export const loaderFeatureKey = 'loader';

export interface State {
  show: boolean;
}

export const initialState: State = {
  show: false,
};

export const reducer = createReducer(
  initialState,
  on(LoaderActions.toggleLoader, (state) => ({
    ...state,
    show: !state.show,
  })),
);
