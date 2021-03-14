import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: NestExpressApplication;
  let accessToken: string;

  beforeAll(async () => {
    accessToken = jwt.sign(
      {
        iss: process.env.OAUTH2_ISSUER,
        sub: 'mr-end2end@clients',
        aud: process.env.OAUTH2_AUDIENCE,
        iat: Math.floor(Date.now() / 1000 - 60), // Now-60s
        exp: Math.floor(Date.now() / 1000 + 86400), // Now+24h
        azp: 'self.authorized.',
        gty: 'client-credentials',
      },
      process.env.OAUTH2_SIGNING_SECRET,
    );
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('hbs');
    await app.init();
  });

  it('@Public: GET /', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(302)
      .expect('Found. Redirecting to /overview');
  });

  it('@Public: GET /overview', () => {
    return request(app.getHttpServer())
      .get('/overview')
      .expect(200)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .then((response) => {
        expect(response.text).toContain('<title>konfigurator</title>');
        expect(response.text).toContain(
          '<h1>Översikt av miljökonfigurationer i OpenShift</h1>',
        );
      });
  });

  it('GET /protected-hello', () => {
    return request(app.getHttpServer())
      .get('/protected-hello')
      .auth(accessToken, { type: 'bearer' })
      .expect(200)
      .expect('Hello World!');
  });
});
