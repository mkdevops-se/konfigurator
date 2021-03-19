import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SessionSerializer } from './session.serializer';
import { UsersModule } from '../users/users.module';
import { Auth0Strategy } from './auth0.strategy';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, Auth0Strategy, SessionSerializer],
  exports: [AuthService],
})
export class AuthModule {}
