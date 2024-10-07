import { Test, TestingModule } from '@nestjs/testing';
import { CPropertiesGroupsResolver } from './c-properties-groups.resolver';
import { CPropertiesGroupsService } from './c-properties-groups.service';

describe('CPropertiesGroupsResolver', () => {
  let resolver: CPropertiesGroupsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CPropertiesGroupsResolver, CPropertiesGroupsService],
    }).compile();

    resolver = module.get<CPropertiesGroupsResolver>(CPropertiesGroupsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
