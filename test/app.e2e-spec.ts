import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/environments (POST)', () => {
    return request(app.getHttpServer())
      .post('/environments')
      .send({
        name: 'app-backend-utv',
        ocp_tenant_domain: 'test.ocp.github.org',
        ocp_namespace_front: 'front',
        ocp_namespace_backend: 'backend',
        ocp_namespace_restricted: 'restricted',
        default_spring_profiles: 'test',
      })
      .expect(201)
      .expect('environment added');
  });

  it('/environments/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/environments/foo')
      .expect(200)
      .expect('here are the environment with ID foo');
  });

  it('/environments (GET)', () => {
    return request(app.getHttpServer())
      .get('/environments')
      .expect(200)
      .expect('here are all environments');
  });

  it('/environments/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put('/environments/foo')
      .send({
        default_spring_profiles: 'test',
      })
      .expect(200)
      .expect('here is the updated environment with ID foo');
  });

  it('/environments/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/environments/foo')
      .expect(200)
      .expect('environment with ID foo deleted');
  });
});
