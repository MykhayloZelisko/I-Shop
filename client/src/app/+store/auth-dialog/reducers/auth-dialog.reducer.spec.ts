import { reducer, initialState } from './auth-dialog.reducer';
import { Action } from '@ngrx/store';

describe('AuthDialog Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
