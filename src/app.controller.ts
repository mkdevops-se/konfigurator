import { Controller, Get, Logger, Redirect, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  private readonly title = 'konfigurator';

  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('/overview', 302)
  root() {
    return { url: '/overview' };
  }

  @Get('overview')
  @Render('overview')
  async getOverview() {
    const environments = await this.appService.getEnvironmentsOverview();
    this.logger.log(
      `Returning overview of ${environments.length} environments`,
    );
    return {
      title: this.title,
      message: `Aktuell status: Miljöinformation visas baserat på senast inläst innehåll i databasen, klicka på "↻"-knapparna för att uppdatera.`,
      environments,
    };
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
