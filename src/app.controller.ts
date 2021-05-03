import {
  Controller,
  Get,
  Logger,
  Redirect,
  Req,
  Render,
  Res,
  UseGuards,
  UseFilters,
  Post,
  Sse,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthExceptionFilter } from './common/filters/auth-exceptions.filter';
import { Auth0LoginGuard } from './common/guards/auth0-login.guard';
import { OpenShiftLoginGuard } from './common/guards/openshift-login.guard';
import { Public } from './common/guards/authenticated.guard';

@Controller()
@UseFilters(AuthExceptionFilter)
export class AppController {
  private readonly logger = new Logger(AppController.name);
  private readonly processEnv;

  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {
    this.processEnv = {
      SERVER_STARTUP_TIMESTAMP: process.env.SERVER_STARTUP_TIMESTAMP,
      IMAGE_TAG: process.env.IMAGE_TAG,
      COMMIT_LINK: process.env.COMMIT_LINK,
      BUILD_TIMESTAMP: process.env.BUILD_TIMESTAMP,
    };
  }

  @Public()
  @Sse('sse')
  sse(): Promise<Observable<MessageEvent>> {
    let eventCounter = 0;
    let baselineEnvOverviewJson, latestEnvOverviewJson;
    this.appService.getEnvironmentsOverview().then((result) => {
      baselineEnvOverviewJson = JSON.stringify(result);
    });

    // @ts-ignore
    return interval(1000).pipe(
      map((_) => {
        eventCounter += 1;

        this.appService.getEnvironmentsOverview().then((result) => {
          latestEnvOverviewJson = JSON.stringify(result);
        });

        if (
          baselineEnvOverviewJson &&
          latestEnvOverviewJson &&
          latestEnvOverviewJson !== baselineEnvOverviewJson
        ) {
          this.logger.log(`Something changed in Environments' Overview`);
          baselineEnvOverviewJson = latestEnvOverviewJson;
          return { data: { event_name: 'overview_reload_required' } };
        } else {
          if (eventCounter % 60 === 0) {
            this.logger.debug(`Sending keep_alive SSE, count ${eventCounter}`);
            return { data: { event_name: 'keep_alive' } };
          }
        }
      }),
    );
  }

  @Public()
  @Get()
  @Redirect('/overview', 302)
  root() {
    return { url: '/overview' };
  }

  @Public()
  @Get('overview')
  @Render('overview')
  async getOverview(@Req() req) {
    const environments = await this.appService.getEnvironmentsOverview();
    this.logger.log(
      `Returning overview of ${environments.length} environments`,
    );
    return {
      user: req.user,
      title: 'Miljööversikt',
      message: `Aktuell status: Miljöinformation visas baserat på senast inläst innehåll i databasen${
        req.user ? ', klicka på "↻"-knapparna för att uppdatera' : ''
      }.`,
      processEnv: this.processEnv,
      environments,
    };
  }

  @Get('protected-hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('jwt')
  getJwt(@Res() res: Response) {
    res.redirect('/profile');
  }

  @Post('jwt')
  createJwt(@Req() req: Request): string {
    const user = req.user;
    this.logger.log(
      `Issuing JWT for '${user.user_id}' with 24 hours expiration time.`,
    );
    return this.authService.signJwt(user.user_id, 86400, {
      given_name: user.given_name,
      family_name: user.family_name,
      groups: user.groups,
      email: user.email,
    });
  }

  @Public()
  @Get('/login')
  getLogin(@Res() res: Response) {
    res.redirect(`/${process.env.OAUTH2_PROVIDER}-login`);
  }

  @Public()
  @UseGuards(Auth0LoginGuard)
  @Get('/auth0-login')
  getAuth0Login() {}

  @Public()
  @UseGuards(Auth0LoginGuard)
  @Get('/auth0-oauth2-callback')
  getAuth0Callback(@Req() req: Request, @Res() res: Response) {
    res.redirect('/overview');
  }

  @Public()
  @UseGuards(OpenShiftLoginGuard)
  @Get('/openshift-login')
  getOpenShiftLogin() {}

  @Public()
  @UseGuards(OpenShiftLoginGuard)
  @Get('/openshift-oauth2-callback')
  getOpenShiftCallback(@Req() req: Request, @Res() res: Response) {
    res.redirect('/overview');
  }

  @Get('/profile')
  @Render('profile')
  getProfile(@Req() req: Request) {
    return { user: req.user, processEnv: this.processEnv };
  }

  @Get('/logout')
  getLogout(@Req() req: Request, @Res() res: Response): void {
    this.logger.log(`Logging out '${req.user.user_id}'`);
    req.logout();
    res.redirect('/overview');
  }
}
