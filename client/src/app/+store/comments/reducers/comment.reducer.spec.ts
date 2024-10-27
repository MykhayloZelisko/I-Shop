import { reducer, initialState } from './comment.reducer';
import { Action } from '@ngrx/store';

describe('Comment Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
