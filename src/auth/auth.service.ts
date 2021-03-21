import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly usersService: UsersService) {}

  // async validateUser(username, pass): Promise<any> {
  //   const user = await this.usersService.findOne(username);
  //   if (user && user.password === pass) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }

  signJwt(subject = 'localhost@clients', accessTokenLifeTimeSec = 600) {
    return jwt.sign(
      {
        sub: subject,
        fakeData: 'an important fact',
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