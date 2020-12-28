import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root() {
    return {
      title: 'konfigurator',
      message: 'Hello world!',
    };
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
