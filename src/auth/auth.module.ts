import { HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { Auth0Strategy } from './auth0.strategy';
import { OpenShiftStrategy } from './openshift.strategy';
import { SessionSerializer } from './session.serializer';
import { AuthService } from './auth.service';

@Module({
  imports: [
    HttpModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.OAUTH2_SIGNING_SECRET,
      signOptions: {
        issuer: process.env.OAUTH2_ISSUER,
        audience: process.env.OAUTH2_AUDIENCE,
        //@ts-ignore
        algorithm: process.env.OAUTH2_SIGNING_ALGORITHM,
      },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    Auth0Strategy,
    OpenShiftStrategy,
    SessionSerializer,
  ],
  exports: [AuthService],
})
export class AuthModule {}
