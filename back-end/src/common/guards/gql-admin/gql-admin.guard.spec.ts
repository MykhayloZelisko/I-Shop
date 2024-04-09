import { GqlAdminGuard } from './gql-admin.guard';

describe('GqlAdminGuard', () => {
  it('should be defined', () => {
    expect(new GqlAdminGuard()).toBeDefined();
  });
});
