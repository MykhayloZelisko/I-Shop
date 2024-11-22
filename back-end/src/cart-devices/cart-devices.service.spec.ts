import { Test, TestingModule } from '@nestjs/testing';
import { CartDevicesService } from './cart-devices.service';

describe('CartDevicesService', () => {
  let service: CartDevicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartDevicesService],
    }).compile();

    service = module.get<CartDevicesService>(CartDevicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
