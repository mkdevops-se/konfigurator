import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Environment } from '../src/environments/environment.entity';
import { EnvironmentsModule } from '../src/environments/environments.module';

describe('EnvironmentsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: false,
          entities: [Environment],
          keepConnectionAlive: true,
          synchronize: true,
        }),
        EnvironmentsModule,
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/environments (POST)', () => {
    const newEnvironment = {
      name: 'katla-utv',
      ocp_tenant_domain: 'test.ocp.github.org',
      ocp_namespace_front: 'front',
      ocp_namespace_backend: 'backend',
      ocp_namespace_restricted: 'restricted',
      default_spring_profiles: 'test',
    };
    return request(app.getHttpServer())
      .post('/environments')
      .send(newEnvironment)
      .expect(201)
      .expect({
        ...newEnvironment,
        ocp_namespace_public: null,
        mq_url: null,
        mq_namespace: null,
        db_url: null,
        comment: null,
      });
  });

  it('/environments/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/environments/katla-utv')
      .expect(200)
      .expect({
        name: 'katla-utv',
        ocp_tenant_domain: 'test.ocp.github.org',
        ocp_namespace_front: 'front',
        ocp_namespace_backend: 'backend',
        ocp_namespace_restricted: 'restricted',
        ocp_namespace_public: null,
        mq_url: null,
        mq_namespace: null,
        db_url: null,
        default_spring_profiles: 'test',
        comment: null,
      });
  });

  it('/environments (GET)', () => {
    return request(app.getHttpServer())
      .get('/environments')
      .expect(200)
      .expect([
        {
          name: 'katla-utv',
          ocp_tenant_domain: 'test.ocp.github.org',
          ocp_namespace_front: 'front',
          ocp_namespace_backend: 'backend',
          ocp_namespace_restricted: 'restricted',
          ocp_namespace_public: null,
          mq_url: null,
          mq_namespace: null,
          db_url: null,
          default_spring_profiles: 'test',
          comment: null,
        },
      ]);
  });

  it('/environments/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put('/environments/katla-utv')
      .send({
        default_spring_profiles: 'prod',
        comment: 'Mats was here',
      })
      .expect(200)
      .expect({
        name: 'katla-utv',
        ocp_tenant_domain: 'test.ocp.github.org',
        ocp_namespace_front: 'front',
        ocp_namespace_backend: 'backend',
        ocp_namespace_restricted: 'restricted',
        ocp_namespace_public: null,
        mq_url: null,
        mq_namespace: null,
        db_url: null,
        default_spring_profiles: 'prod',
        comment: 'Mats was here',
      });
  });

  it('/environments/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/environments/katla-utv')
      .expect(200)
      .expect({
        name: 'katla-utv',
        ocp_tenant_domain: 'test.ocp.github.org',
        ocp_namespace_front: 'front',
        ocp_namespace_backend: 'backend',
        ocp_namespace_restricted: 'restricted',
        ocp_namespace_public: null,
        mq_url: null,
        mq_namespace: null,
        db_url: null,
        default_spring_profiles: 'prod',
        comment: 'Mats was here',
      });
  });
});
