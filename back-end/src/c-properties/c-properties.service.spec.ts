import { Test, TestingModule } from '@nestjs/testing';
import { CPropertiesService } from './c-properties.service';

describe('CPropertiesService', () => {
  let service: CPropertiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CPropertiesService],
    }).compile();

    service = module.get<CPropertiesService>(CPropertiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
