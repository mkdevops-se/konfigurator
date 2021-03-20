import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.OAUTH2_SIGNING_SECRET,
    });
  }

  async validate(payload: any) {
    this.logger.debug(`validate: payload=${JSON.stringify(payload)}`);
    return { userId: payload.sub, username: payload.username };
  }
}
