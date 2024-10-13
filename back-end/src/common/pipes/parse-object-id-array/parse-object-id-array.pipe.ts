import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ParseObjectIdPipe } from '../parse-object-id/parse-object-id.pipe';

@Injectable()
export class ParseObjectIdArrayPipe implements PipeTransform {
  public constructor(private parseObjectIdPipe: ParseObjectIdPipe) {}

  public transform(value: string[], metadata: ArgumentMetadata): string[] {
    if (!value.length) {
      return value;
    }

    return value.map((id) => {
      return this.parseObjectIdPipe.transform(id, metadata);
    });
  }
}
