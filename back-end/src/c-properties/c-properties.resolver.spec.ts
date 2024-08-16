import { Test, TestingModule } from '@nestjs/testing';
import { CPropertiesResolver } from './c-properties.resolver';
import { CPropertiesService } from './c-properties.service';

describe('CPropertiesResolver', () => {
  let resolver: CPropertiesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CPropertiesResolver, CPropertiesService],
    }).compile();

    resolver = module.get<CPropertiesResolver>(CPropertiesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
