import { reducer, initialState } from './form.reducer';
import { Action } from '@ngrx/store';

describe('Form Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
