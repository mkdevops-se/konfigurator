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
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { Response, Request } from 'express';

import { AuthExceptionFilter } from './common/filters/auth-exceptions.filter';
import { LoginGuard } from './common/guards/login.guard';
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
      message: `Aktuell status: Miljöinformation visas baserat på senast inläst innehåll i databasen, klicka på "↻"-knapparna för att uppdatera.`,
      processEnv: this.processEnv,
      environments,
    };
  }

  @Get('protected-hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('jwt')
  getJwt(): string {
    return this.authService.signJwt();
  }

  @Public()
  @UseGuards(LoginGuard)
  @Get('/login')
  getLogin() {}

  @Public()
  @UseGuards(LoginGuard)
  @Get('/callback')
  getCallback(@Req() req: Request, @Res() res: Response) {
    res.redirect('/');
  }

  @Get('/profile')
  @Render('profile')
  getProfile(@Req() req: Request) {
    return { user: req.user, processEnv: this.processEnv };
  }

  @Get('/logout')
  getLogout(@Req() req: Request, @Res() res: Response): void {
    req.logout();
    res.redirect('/');
  }
}
