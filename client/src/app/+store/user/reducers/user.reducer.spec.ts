import { reducer, initialState } from './user.reducer';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';

describe('User Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState as UserInterface | null, action);

      expect(result).toBe(initialState as UserInterface | null);
    });
  });
});
