import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  // async validateUser(username, pass): Promise<any> {
  //   const user = await this.usersService.findOne(username);
  //   if (user && user.password === pass) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }

  signJwt(): string {
    return jwt.sign(
      {
        sub: 'admin@konfigurator',
        fakeData: 'an important fact',
      },
      process.env.OAUTH2_SIGNING_SECRET,
      {
        issuer: process.env.OAUTH2_ISSUER,
        audience: process.env.OAUTH2_AUDIENCE,
        //@ts-ignore
        algorithm: 'HS256',
        expiresIn: '600s',
      },
    );
  }
}
