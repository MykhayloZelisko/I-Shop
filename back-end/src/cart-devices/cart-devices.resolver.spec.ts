import { Test, TestingModule } from '@nestjs/testing';
import { CartDevicesResolver } from './cart-devices.resolver';
import { CartDevicesService } from './cart-devices.service';

describe('CartDevicesResolver', () => {
  let resolver: CartDevicesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartDevicesResolver, CartDevicesService],
    }).compile();

    resolver = module.get<CartDevicesResolver>(CartDevicesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
