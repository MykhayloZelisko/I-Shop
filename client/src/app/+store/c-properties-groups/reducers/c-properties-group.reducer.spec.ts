import { reducer, initialState } from './c-properties-group.reducer';
import { Action } from '@ngrx/store';

describe('CPropertiesGroup Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
