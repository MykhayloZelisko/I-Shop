import { createReducer, on } from '@ngrx/store';
import { FormActions } from '../actions/form.actions';

export const formFeatureKey = 'form';

export interface State {
  isCleared: boolean;
}

export const initialState: State = {
  isCleared: false,
};

export const reducer = createReducer(
  initialState,
  on(FormActions.clearFormsOn, (state) => ({
    ...state,
    isCleared: true,
  })),
  on(FormActions.clearFormsOff, (state) => ({
    ...state,
    isCleared: false,
  })),
);
