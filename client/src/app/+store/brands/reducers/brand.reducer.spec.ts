import { reducer, initialState } from './brand.reducer';
import { Action } from '@ngrx/store';

describe('Brand Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
