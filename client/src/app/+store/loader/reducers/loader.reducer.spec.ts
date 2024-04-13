import { reducer, initialState } from './loader.reducer';
import { Action } from '@ngrx/store';

describe('Loader Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
