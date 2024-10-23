import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseObjectIdNullablePipe implements PipeTransform {
  public transform(
    value: string | null,
    metadata: ArgumentMetadata,
  ): string | null {
    if (value === null) {
      return null;
    }
    if (!isValidObjectId(value)) {
      throw new BadRequestException(
        `${metadata.data} - Must be a valid MongoDB ObjectId`,
        'Validation Error',
      );
    }
    return value;
  }
}
