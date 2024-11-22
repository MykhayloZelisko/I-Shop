import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntegerPipe implements PipeTransform {
  public transform(value: unknown, metadata: ArgumentMetadata): number {
    const isFiniteNumber = value === Number(value) && isFinite(Number(value));
    const isInteger = Number(value) === Math.trunc(Number(value));
    const isPositive = Number(value) > 0;
    if (
      typeof value !== 'number' ||
      !isFiniteNumber ||
      !isInteger ||
      !isPositive
    ) {
      throw new BadRequestException(
        `${metadata.data} - Must be a positive integer number`,
        'Validation Error',
      );
    }
    return value;
  }
}
