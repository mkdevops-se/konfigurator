import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  signJwt(subject = 'localhost@clients', accessTokenLifeTimeSec = 600) {
    return jwt.sign(
      {
        iss: process.env.OAUTH2_ISSUER,
        sub: subject,
        aud: process.env.OAUTH2_AUDIENCE,
        iat: Math.floor(Date.now() / 1000), // Now
        exp: Math.floor(Date.now() / 1000 + accessTokenLifeTimeSec), // Now + token duration
        azp: 'self.authorized.',
        gty: 'client-credentials',
      },
      process.env.OAUTH2_SIGNING_SECRET,
    );
  }

  saveLocalAccessToken() {
    const accessToken = this.signJwt();
    fs.writeFileSync(process.env.OAUTH2_LOCAL_ACCESS_TOKEN, accessToken);
  }
}
