import { use } from 'passport';
import * as OAuth2Strategy from 'passport-oauth2';
import { HttpService, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { OpenShiftUserProfileInterface } from '../interfaces/openshift-user-profile.interface';

@Injectable()
export class OpenShiftStrategy extends OAuth2Strategy {
  private readonly logger = new Logger(OpenShiftStrategy.name);

  constructor(
    private httpService: HttpService,
    private usersService: UsersService,
  ) {
    super(
      {
        authorizationURL: process.env.OAUTH2_AUTHORIZATION_URL,
        tokenURL: process.env.OAUTH2_TOKEN_URL,
        clientID: process.env.OAUTH2_CLIENT_ID,
        clientSecret: process.env.OAUTH2_CLIENT_SECRET,
        callbackURL: process.env.OAUTH2_CALLBACK_URL,
        scope: ['user:info', 'user:check-access'],
        scopeSeparator: ' ',
        state: true,
        sessionKey: process.env.SESSION_SECRET,
      },
      async (accessToken, refreshToken, extraParams, profile, done) => {
        const openShiftUserProfile: OpenShiftUserProfileInterface = profile;
        this.logger.debug(
          `User '${
            openShiftUserProfile.metadata.selfLink
          }' verified, with access_token=${accessToken}, refreshToken=${refreshToken}, extraParams=${JSON.stringify(
            extraParams,
          )}, profile=${JSON.stringify(profile)}`,
        );
        const [userEntity, created] = await this.usersService.getOrCreate({
          user_id: openShiftUserProfile.metadata.name,
          id: openShiftUserProfile.metadata.uid,
          display_name: openShiftUserProfile.fullName,
          given_name: openShiftUserProfile.fullName.split(' ')[0],
          family_name: openShiftUserProfile.fullName
            .split(' ')
            .splice(1, 3)
            .join(' '),
          provider: openShiftUserProfile.apiVersion,
          email: openShiftUserProfile.identities[0].split(':')[1],
          identities: openShiftUserProfile.identities,
          groups: openShiftUserProfile.groups,
        });
        await this.usersService.update(userEntity.user_id, {
          konfigurator_login_count: (userEntity.konfigurator_login_count += 1),
        });
        this.logger.log(
          `User '${userEntity.user_id}' with email '${userEntity.email}' ${
            created ? 'added to database' : 'retrieved from database'
          }, login count: ${userEntity.konfigurator_login_count}`,
        );
        return await done(null, userEntity);
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

  async userProfile(
    accessToken: string,
    done: (err?: Error | null, profile?: OpenShiftUserProfileInterface) => void,
  ) {
    const userInfoResponse = await this.httpService
      .get(`${process.env.OAUTH2_USERINFO_URL}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 500,
      })
      .toPromise();
    return done(null, userInfoResponse.data);
  }
}
