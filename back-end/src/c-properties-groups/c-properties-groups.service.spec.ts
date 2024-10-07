import { Test, TestingModule } from '@nestjs/testing';
import { CPropertiesGroupsService } from './c-properties-groups.service';

describe('CPropertiesGroupsService', () => {
  let service: CPropertiesGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CPropertiesGroupsService],
    }).compile();

    service = module.get<CPropertiesGroupsService>(CPropertiesGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
