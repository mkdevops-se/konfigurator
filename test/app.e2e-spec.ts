import * as request from 'supertest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';

describe('AppController (e2e)', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          if (!req.headers.authorization) {
            throw new UnauthorizedException();
          }
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('hbs');
    await app.init();
  });

  it('GET /protected', () => {
    return request(app.getHttpServer())
      .get('/protected')
      .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...-ptvwvFcab_K5B4q1EEpTQc', {
        type: 'bearer',
      })
      .expect(200)
      .expect('a secret string');
  });

  it('GET /', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(302)
      .expect('Found. Redirecting to /overview');
  });

  it('GET /overview', () => {
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

  it('GET /hello', () => {
    return request(app.getHttpServer())
      .get('/hello')
      .expect(200)
      .expect('Hello World!');
  });
});
