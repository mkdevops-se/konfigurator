import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { EnvironmentsModule } from '../src/environments/environments.module';

describe('EnvironmentsController (e2e)', () => {
  let app: INestApplication;
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
      imports: [AppModule, EnvironmentsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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
        .auth(accessToken, { type: 'bearer' })
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
          comment_origin: null,
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
        .auth(accessToken, { type: 'bearer' })
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
        .auth(accessToken, { type: 'bearer' })
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
        .auth(accessToken, { type: 'bearer' })
        .send(badEnvironment2)
        .expect(400);
    });
  });

  describe('@Public: GET /environments', () => {
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
          comment_origin: null,
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
            comment_origin: null,
          },
        ]);
    });
  });

  describe('PUT /environments/:name', () => {
    it('updates defined-and-writeable properties of an entity', () => {
      return request(app.getHttpServer())
        .put('/environments/katla-utv')
        .auth(accessToken, { type: 'bearer' })
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
          comment_origin: null,
        });
    });

    it('returns a 404 error for incorrect /environments/:name', () => {
      return request(app.getHttpServer())
        .put('/environments/katla-utv-is-not-there')
        .auth(accessToken, { type: 'bearer' })
        .send({
          default_spring_profiles: 'prod',
          comment: 'Mats was here',
        })
        .expect(404);
    });

    it('rejects updates to undefined-or-non-writeable properties', async () => {
      await request(app.getHttpServer())
        .put('/environments/katla-utv')
        .auth(accessToken, { type: 'bearer' })
        .send({
          made_up_today: 'not okay',
          comment: 'Mats was here',
        })
        .expect(400);

      await request(app.getHttpServer())
        .put('/environments/katla-utv')
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'cannot-be-changed',
          comment: 'Mats was here',
        })
        .expect(400);

      await request(app.getHttpServer())
        .put('/environments/katla-utv')
        .auth(accessToken, { type: 'bearer' })
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
        .auth(accessToken, { type: 'bearer' })
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
          comment_origin: null,
        });
    });

    it('returns a 404 error for incorrect /environments/:name', () => {
      return request(app.getHttpServer())
        .delete('/environments/katla-utv-is-not-there')
        .auth(accessToken, { type: 'bearer' })
        .expect(404);
    });
  });
});
