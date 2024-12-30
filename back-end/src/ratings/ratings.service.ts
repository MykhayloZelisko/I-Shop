import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Rating, RatingDocument } from './schemas/rating.schema';
import { DevicesService } from '../devices/devices.service';

@Injectable()
export class RatingsService {
  public constructor(
    @InjectModel(Rating.name) private ratingModel: Model<RatingDocument>,
    private devicesService: DevicesService,
  ) {}

  public async createRating(
    userId: string,
    deviceId: string,
    rate: number,
    session: ClientSession,
  ): Promise<void> {
    const rating = await this.ratingModel.findOne({ userId, deviceId }).exec();
    if (rating) {
      throw new ForbiddenException('You cannot re-rate this device');
    }
    await this.ratingModel.create([{ deviceId, userId, rate }], { session });
    await this.recalculateDeviceRating(deviceId, session);
  }

  public async recalculateDeviceRating(
    deviceId: string,
    session: ClientSession,
  ): Promise<void> {
    const ratings = await this.ratingModel.find({ deviceId }).exec();
    const totalRating = ratings.reduce((acc, rating) => acc + rating.rate, 0);
    const newRating = ratings.length ? totalRating / ratings.length : 0;
    await this.devicesService.recalculateDeviceRating(
      deviceId,
      ratings.length,
      newRating,
      session,
    );
  }

  public async deleteRating(
    userId: string,
    deviceId: string,
    session: ClientSession,
  ): Promise<void> {
    const rating = await this.ratingModel
      .findOneAndDelete({ userId, deviceId })
      .session(session)
      .exec();
    if (!rating) {
      throw new NotFoundException('Rating not found');
    }
    await this.recalculateDeviceRating(deviceId, session);
  }

  public async updateRating(
    userId: string,
    deviceId: string,
    rate: number,
    session: ClientSession,
  ): Promise<void> {
    const rating = await this.ratingModel
      .findOneAndUpdate({ userId, deviceId }, { rate })
      .session(session)
      .exec();
    if (!rating) {
      throw new NotFoundException('Rating not found');
    }
    await this.recalculateDeviceRating(deviceId, session);
  }
}
