import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
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
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
