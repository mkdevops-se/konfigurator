import { use } from 'passport';
import * as OAuth2Strategy from 'passport-oauth2';
import { HttpService, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Auth0IdTokenInterface } from '../interfaces/auth0-id-token.interface';
import { AuthService } from './auth.service';

@Injectable()
export class Auth0Strategy extends OAuth2Strategy {
  public name = 'auth0';
  private readonly logger = new Logger(Auth0Strategy.name);

  constructor(
    private httpService: HttpService,
    private authService: AuthService,
    private usersService: UsersService,
  ) {
    super(
      {
        authorizationURL: process.env.OAUTH2_AUTHORIZATION_URL,
        tokenURL: process.env.OAUTH2_TOKEN_URL,
        clientID: process.env.OAUTH2_CLIENT_ID,
        clientSecret: process.env.OAUTH2_CLIENT_SECRET,
        callbackURL: process.env.OAUTH2_CALLBACK_URL,
        scope: ['openid', 'email', 'profile'],
        scopeSeparator: ' ',
        state: true,
        sessionKey: process.env.SESSION_SECRET,
        skipUserProfile: true,
      },
      async (accessToken, refreshToken, extraParams, profile, done) => {
        const auth0IdToken: Partial<Auth0IdTokenInterface> = this.authService.decodeIdToken(
          extraParams['id_token'],
        ).payload;
        this.logger.debug(
          `User '${
            auth0IdToken.sub
          }' verified, with access_token=${accessToken}, refreshToken=${refreshToken}, extraParams=${JSON.stringify(
            extraParams,
          )}, profile=${JSON.stringify(auth0IdToken)}`,
        );
        const [userEntity, created] = await this.usersService.getOrCreate({
          user_id: auth0IdToken.sub,
          id: auth0IdToken.sub,
          display_name: auth0IdToken.name,
          provider: auth0IdToken.sub.split('|')[0],
          family_name: auth0IdToken.family_name,
          given_name: auth0IdToken.given_name,
          email: auth0IdToken.email,
          picture_url: auth0IdToken.picture,
          locale: auth0IdToken.locale,
          nickname: auth0IdToken.nickname,
        });
        await this.usersService.update(userEntity.user_id, {
          konfigurator_login_count: (userEntity.konfigurator_login_count += 1),
        });
        this.logger.log(
          `User '${userEntity.user_id}' with email '${userEntity.email}' ${
            created ? 'added to database' : 'retrieved from database'
          }, login count: ${userEntity.konfigurator_login_count}`,
        );
        return done(null, userEntity);
      },
    );
    use(this);
    this.logger.debug(`Initialization completed.`);
  }

  authenticate(request) {
    this.logger.debug(
      `Authenticating client from ${request.ip} (${request.headers['user-agent']}) on URL ${request.url} ...`,
    );
    super.authenticate(request);
  }
}
