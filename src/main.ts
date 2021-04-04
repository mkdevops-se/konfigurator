import * as exphbs from 'express-handlebars';
import * as passport from 'passport';
import * as session from 'express-session';
import flash = require('connect-flash');
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AppModule } from './app.module';
import { User as UserModel } from './users/entities/user.entity';

declare global {
  namespace Express {
    export interface User extends UserModel {}
  }
}

async function bootstrap() {
  process.env.SERVER_STARTUP_TIMESTAMP = new Date()
    .toISOString()
    .replace(/\.\d{3}Z/, 'Z');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main' }));
  app.setViewEngine('hbs');

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  await app.listen(
    +configService.get<string>('WEB_SERVER_PORT'),
    configService.get<string>('WEB_SERVER_HOST'),
  );
}
bootstrap();
