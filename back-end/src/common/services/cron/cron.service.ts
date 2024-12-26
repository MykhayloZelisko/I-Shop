import { Injectable } from '@nestjs/common';
import { CartsService } from '../../../carts/carts.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
  public constructor(private cartsService: CartsService) {}

  @Cron('0 0 * * *')
  public async cleanupOldCarts(): Promise<void> {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() - 24);
    await this.cartsService.deleteOldCarts(expirationDate);
  }
}
