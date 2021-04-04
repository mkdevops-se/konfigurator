import { use } from 'passport';
import { Strategy } from 'passport-auth0';
import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Auth0UserProfile } from '../interfaces/auth0-user-profile.interface';

@Injectable()
export class Auth0Strategy extends Strategy {
  private readonly logger = new Logger(Auth0Strategy.name);

  constructor(private usersService: UsersService) {
    super(
      {
        domain: process.env.OAUTH2_TENANT_DOMAIN,
        clientID: process.env.OAUTH2_CLIENT_ID,
        clientSecret: process.env.OAUTH2_CLIENT_SECRET,
        callbackURL: process.env.OAUTH2_CALLBACK_URL,
        state: true,
      },
      async (accessToken, refreshToken, extraParams, profile, done) => {
        const auth0UserProfile: Auth0UserProfile = profile;
        this.logger.debug(
          `User '${
            auth0UserProfile.user_id
          }' verified, with access_token=${accessToken}, refreshToken=${refreshToken}, extraParams=${JSON.stringify(
            extraParams,
          )}, profile=${JSON.stringify(auth0UserProfile)}`,
        );
        const [userEntity, created] = await this.usersService.getOrCreate({
          user_id: auth0UserProfile.user_id,
          id: auth0UserProfile.id,
          display_name: auth0UserProfile.displayName,
          provider: auth0UserProfile.provider,
          family_name: auth0UserProfile.name.familyName,
          given_name: auth0UserProfile.name.givenName,
          email: auth0UserProfile.emails[0].value,
          picture_url: auth0UserProfile.picture,
          locale: auth0UserProfile.locale,
          nickname: auth0UserProfile.nickname,
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
  }
}
