import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformIdInterceptor implements NestInterceptor {
  public intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(map((data) => this.transformIds(data)));
  }

  public transformIds(data: unknown): unknown {
    if (Array.isArray(data)) {
      return data.map((item) => this.transformIds(item));
    } else if (typeof data === 'object' && data !== null) {
      const transformedData = {};
      for (const key in data) {
        const newKey = key === '_id' ? 'id' : key;
        transformedData[newKey] =
          newKey === 'id' ? data[key].toString() : this.transformIds(data[key]);
      }
      return transformedData;
    } else {
      return data;
    }
  }
}
