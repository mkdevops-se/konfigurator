import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from '../src/app.module';
import { TasksModule } from '../src/tasks/tasks.module';

describe('TasksController (e2e)', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TasksModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('hbs');
    await app.init();
  });

  describe('GET /tasks', () => {
    it('returns a HTML page with a tasks overview', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .then((response) => {
         expect(response.text).toContain('<title>tasks</title>');
         expect(response.text).toContain(
           '<h1>Översikt av bakgrundsjobb</h1>',
         );
        });
    });
  });
});
