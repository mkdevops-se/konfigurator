import {
  ExecutionContext,
  INestApplication,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { EnvironmentsModule } from '../src/environments/environments.module';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';

describe('EnvironmentsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, EnvironmentsModule],
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
    await app.init();
  });

  it('GET /environments/protected', () => {
    return request(app.getHttpServer())
      .get('/environments/protected')
      .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...-ptvwvFcab_K5B4q1EEpTQc', {
        type: 'bearer',
      })
      .expect(200)
      .expect('a secret string');
  });

  describe('POST /environments', () => {
    it('creates a valid environment', () => {
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
          rank: 0,
          ocp_namespace_public: null,
          mq_url: null,
          mq_namespace: null,
          db_url: null,
          login_url: null,
          gateway_url: null,
          comment: null,
        });
    });

    it('rejects an invalid environment', async () => {
      const duplicateEnvironment = {
        name: 'katla-utv',
        ocp_tenant_domain: 'test.ocp.github.org',
        ocp_namespace_front: 'front',
        ocp_namespace_backend: 'backend',
        ocp_namespace_restricted: 'restricted',
        default_spring_profiles: 'test',
      };
      await request(app.getHttpServer())
        .post('/environments')
        .send(duplicateEnvironment)
        .expect(409);

      const badEnvironment1 = {
        name: 'katla-utv1',
        ocp_tenant_domain: 'test.ocp.github.org',
        ocp_namespace_front: '', // Illegally empty.
        ocp_namespace_backend: 'backend',
        ocp_namespace_restricted: 'restricted',
        default_spring_profiles: 'test',
      };
      await request(app.getHttpServer())
        .post('/environments')
        .send(badEnvironment1)
        .expect(400);

      const badEnvironment2 = {
        name: 'katla-utv2',
        ocp_tenant_domain: 'test.ocp.github.org',
        ocp_namespace_front: 'front',
        ocp_namespace_backend: 'backend',
        ocp_namespace_restricted: 'restricted',
        default_spring_profiles: 'test',
        someNewProperty: 'reject me', // Illegally undefined.
      };
      await request(app.getHttpServer())
        .post('/environments')
        .send(badEnvironment2)
        .expect(400);
    });
  });

  describe('GET /environments', () => {
    it('returns a specific /environments/:name', () => {
      return request(app.getHttpServer())
        .get('/environments/katla-utv')
        .expect(200)
        .expect({
          name: 'katla-utv',
          rank: 0,
          ocp_tenant_domain: 'test.ocp.github.org',
          ocp_namespace_front: 'front',
          ocp_namespace_backend: 'backend',
          ocp_namespace_restricted: 'restricted',
          ocp_namespace_public: null,
          mq_url: null,
          mq_namespace: null,
          db_url: null,
          default_spring_profiles: 'test',
          login_url: null,
          gateway_url: null,
          comment: null,
        });
    });

    it('returns a 404 error for incorrect /environments/:name', () => {
      return request(app.getHttpServer())
        .get('/environments/katla-utv-is-not-there')
        .expect(404);
    });

    it('returns all /environments', () => {
      return request(app.getHttpServer())
        .get('/environments')
        .expect(200)
        .expect([
          {
            name: 'katla-utv',
            rank: 0,
            ocp_tenant_domain: 'test.ocp.github.org',
            ocp_namespace_front: 'front',
            ocp_namespace_backend: 'backend',
            ocp_namespace_restricted: 'restricted',
            ocp_namespace_public: null,
            mq_url: null,
            mq_namespace: null,
            db_url: null,
            default_spring_profiles: 'test',
            login_url: null,
            gateway_url: null,
            comment: null,
          },
        ]);
    });
  });

  describe('PUT /environments/:name', () => {
    it('updates defined-and-writeable properties of an entity', () => {
      return request(app.getHttpServer())
        .put('/environments/katla-utv')
        .send({
          rank: 1000,
          default_spring_profiles: 'prod',
          login_url: 'https://honeypots-for-free.dot.com',
          gateway_url: 'https://the-gateway-takes-you-there.travel',
          comment: 'Mats was here',
        })
        .expect(200)
        .expect({
          name: 'katla-utv',
          rank: 1000,
          ocp_tenant_domain: 'test.ocp.github.org',
          ocp_namespace_front: 'front',
          ocp_namespace_backend: 'backend',
          ocp_namespace_restricted: 'restricted',
          ocp_namespace_public: null,
          mq_url: null,
          mq_namespace: null,
          db_url: null,
          default_spring_profiles: 'prod',
          login_url: 'https://honeypots-for-free.dot.com',
          gateway_url: 'https://the-gateway-takes-you-there.travel',
          comment: 'Mats was here',
        });
    });

    it('returns a 404 error for incorrect /environments/:name', () => {
      return request(app.getHttpServer())
        .put('/environments/katla-utv-is-not-there')
        .send({
          default_spring_profiles: 'prod',
          comment: 'Mats was here',
        })
        .expect(404);
    });

    it('rejects updates to undefined-or-non-writeable properties', async () => {
      await request(app.getHttpServer())
        .put('/environments/katla-utv')
        .send({
          made_up_today: 'not okay',
          comment: 'Mats was here',
        })
        .expect(400);

      await request(app.getHttpServer())
        .put('/environments/katla-utv')
        .send({
          name: 'cannot-be-changed',
          comment: 'Mats was here',
        })
        .expect(400);

      await request(app.getHttpServer())
        .put('/environments/katla-utv')
        .send({
          comment: '',
        })
        .expect(400);
    });
  });

  describe('DELETE /environments/:name', () => {
    it('deletes specific environment by name', () => {
      return request(app.getHttpServer())
        .delete('/environments/katla-utv')
        .expect(200)
        .expect({
          name: 'katla-utv',
          rank: 1000,
          ocp_tenant_domain: 'test.ocp.github.org',
          ocp_namespace_front: 'front',
          ocp_namespace_backend: 'backend',
          ocp_namespace_restricted: 'restricted',
          ocp_namespace_public: null,
          mq_url: null,
          mq_namespace: null,
          db_url: null,
          default_spring_profiles: 'prod',
          login_url: 'https://honeypots-for-free.dot.com',
          gateway_url: 'https://the-gateway-takes-you-there.travel',
          comment: 'Mats was here',
        });
    });

    it('returns a 404 error for incorrect /environments/:name', () => {
      return request(app.getHttpServer())
        .delete('/environments/katla-utv-is-not-there')
        .expect(404);
    });
  });
});
