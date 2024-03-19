import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './auth.resolver';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [UsersModule],
  providers: [AuthService, AuthResolver, LocalStrategy, SessionSerializer],
  exports: [AuthService],
})
export class AuthModule {}
