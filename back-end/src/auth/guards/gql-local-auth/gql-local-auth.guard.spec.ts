import { GqlLocalAuthGuard } from './gql-local-auth.guard';

describe('GqlLocalAuthGuard', () => {
  it('should be defined', () => {
    expect(new GqlLocalAuthGuard()).toBeDefined();
  });
});
