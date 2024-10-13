import { reducer, initialState } from './c-property.reducer';
import { Action } from '@ngrx/store';

describe('CProperty Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
