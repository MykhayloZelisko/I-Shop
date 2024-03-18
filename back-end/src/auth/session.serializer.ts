import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  public constructor() {
    super();
  }

  public serializeUser(
    user: unknown,
    done: (err: Error | null, user: unknown) => void,
  ): void {
    done(null, user);
  }

  public deserializeUser(
    payload: unknown,
    done: (err: Error | null, payload: unknown) => void,
  ): void {
    done(null, payload);
  }
}
