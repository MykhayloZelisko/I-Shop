import { Test, TestingModule } from '@nestjs/testing';
import { GuestCartsService } from './guest-carts.service';

describe('GuestCartsService', () => {
  let service: GuestCartsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuestCartsService],
    }).compile();

    service = module.get<GuestCartsService>(GuestCartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
