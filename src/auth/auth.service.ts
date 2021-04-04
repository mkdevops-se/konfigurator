import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly usersService: UsersService) {}

  decodeIdToken(token) {
    jwt.verify(token, process.env.OAUTH2_CLIENT_SECRET, {
      issuer: process.env.OAUTH2_ISSUER,
      audience: process.env.OAUTH2_CLIENT_ID,
    });
    return jwt.decode(token, { complete: true });
  }

  signJwt(subject = 'localhost', accessTokenLifeTimeSec = 600, extras = {}) {
    return jwt.sign(
      {
        ...extras,
        sub: subject,
      },
      process.env.OAUTH2_SIGNING_SECRET,
      {
        issuer: process.env.OAUTH2_ISSUER,
        audience: process.env.OAUTH2_AUDIENCE,
        //@ts-ignore
        algorithm: 'HS256',
        expiresIn: `${accessTokenLifeTimeSec}s`,
      },
    );
  }

  saveLocalAccessToken() {
    const accessToken = this.signJwt();
    fs.writeFileSync(process.env.OAUTH2_LOCAL_ACCESS_TOKEN, accessToken);
  }
}
