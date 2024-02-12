import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './auth.resolver';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({ session: true }), UsersModule],
  providers: [AuthService, AuthResolver, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
