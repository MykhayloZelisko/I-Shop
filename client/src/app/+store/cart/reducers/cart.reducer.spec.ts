import { reducer, initialState } from './cart.reducer';
import { Action } from '@ngrx/store';

describe('CartDevice Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
