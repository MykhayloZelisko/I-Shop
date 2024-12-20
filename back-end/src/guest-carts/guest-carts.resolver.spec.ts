import { Test, TestingModule } from '@nestjs/testing';
import { GuestCartsResolver } from './guest-carts.resolver';
import { GuestCartsService } from './guest-carts.service';

describe('GuestCartsResolver', () => {
  let resolver: GuestCartsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuestCartsResolver, GuestCartsService],
    }).compile();

    resolver = module.get<GuestCartsResolver>(GuestCartsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
