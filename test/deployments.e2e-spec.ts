import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DeploymentsModule } from '../src/deployments/deployments.module';

describe('DeploymentsController (e2e)', () => {
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
      imports: [AppModule, DeploymentsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /environments/katla-utv/deployments', () => {
    it('creates a valid gateway deployment', () => {
      const newDeployment = {
        name: 'bff-gateway',
        ocp_namespace: 'front',
        is_gateway: true,
      };
      return request(app.getHttpServer())
        .post('/environments/katla-utv/deployments')
        .auth(accessToken, { type: 'bearer' })
        .send(newDeployment)
        .expect(201)
        .expect({
          environment: 'katla-utv',
          ...newDeployment,
          memory_min: null,
          memory_max: null,
          cpu_min: null,
          cpu_max: null,
          replicas_target: null,
          replicas_current: null,
          spring_profiles_active: null,
          image_tag: null,
          build_timestamp: null,
        });
    });

    it('creates a valid backend deployment', () => {
      const newDeployment = {
        name: 'surgrisen',
        ocp_namespace: 'backend',
      };
      return request(app.getHttpServer())
        .post('/environments/katla-utv/deployments')
        .auth(accessToken, { type: 'bearer' })
        .send(newDeployment)
        .expect(201)
        .expect({
          environment: 'katla-utv',
          ...newDeployment,
          is_gateway: false,
          memory_min: null,
          memory_max: null,
          cpu_min: null,
          cpu_max: null,
          replicas_target: null,
          replicas_current: null,
          spring_profiles_active: null,
          image_tag: null,
          build_timestamp: null,
        });
    });

    it('rejects an invalid deployment', async () => {
      const duplicateDeployment = {
        name: 'bff-gateway',
        ocp_namespace: 'front',
      };
      await request(app.getHttpServer())
        .post('/environments/katla-utv/deployments')
        .auth(accessToken, { type: 'bearer' })
        .send(duplicateDeployment)
        .expect(409);

      const badDeployment1 = {
        name: 'bff-gateway',
        ocp_namespace: '', // Illegally empty.
      };
      await request(app.getHttpServer())
        .post('/environments/katla-utv/deployments')
        .auth(accessToken, { type: 'bearer' })
        .send(badDeployment1)
        .expect(400);

      const badDeployment2 = {
        name: 'bff-gateway',
        ocp_namespace: 'front',
        someNewProperty: 'reject me', // Illegally undefined.
      };
      await request(app.getHttpServer())
        .post('/environments/katla-utv/deployments')
        .auth(accessToken, { type: 'bearer' })
        .send(badDeployment2)
        .expect(400);
    });
  });

  describe('@Public: GET /environments/katla-utv/deployments', () => {
    it('returns a specific /environments/katla-utv/deployments/:name', () => {
      return request(app.getHttpServer())
        .get('/environments/katla-utv/deployments/bff-gateway')
        .expect(200)
        .expect({
          environment: 'katla-utv',
          ocp_namespace: 'front',
          name: 'bff-gateway',
          is_gateway: true,
          memory_min: null,
          memory_max: null,
          cpu_min: null,
          cpu_max: null,
          replicas_target: null,
          replicas_current: null,
          spring_profiles_active: null,
          image_tag: null,
          build_timestamp: null,
        });
    });

    it('returns a 404 error for incorrect /environments/katla-utv/deployments/:name', () => {
      return request(app.getHttpServer())
        .get('/environments/katla-utv/deployments/one-yet-to-be-created')
        .expect(404);
    });

    it('returns all /environments/katla-utv/deployments', () => {
      return request(app.getHttpServer())
        .get('/environments/katla-utv/deployments')
        .expect(200)
        .expect([
          {
            environment: 'katla-utv',
            ocp_namespace: 'backend',
            name: 'surgrisen',
            is_gateway: false,
            memory_min: null,
            memory_max: null,
            cpu_min: null,
            cpu_max: null,
            replicas_target: null,
            replicas_current: null,
            spring_profiles_active: null,
            image_tag: null,
            build_timestamp: null,
          },
          {
            environment: 'katla-utv',
            ocp_namespace: 'front',
            name: 'bff-gateway',
            is_gateway: true,
            memory_min: null,
            memory_max: null,
            cpu_min: null,
            cpu_max: null,
            replicas_target: null,
            replicas_current: null,
            spring_profiles_active: null,
            image_tag: null,
            build_timestamp: null,
          },
        ]);
    });
  });

  describe('PUT /environments/katla-utv/deployments/:name', () => {
    it('updates defined-and-writeable properties of an entity', () => {
      return request(app.getHttpServer())
        .put('/environments/katla-utv/deployments/bff-gateway')
        .auth(accessToken, { type: 'bearer' })
        .send({
          cpu_min: '50m',
          cpu_max: '400m',
          replicas_target: 2,
        })
        .expect(200)
        .expect({
          environment: 'katla-utv',
          ocp_namespace: 'front',
          name: 'bff-gateway',
          is_gateway: true,
          memory_min: null,
          memory_max: null,
          cpu_min: '50m',
          cpu_max: '400m',
          replicas_target: 2,
          replicas_current: null,
          spring_profiles_active: null,
          image_tag: null,
          build_timestamp: null,
        });
    });

    it('returns a 404 error for incorrect /environments/katla-utv/deployments/:name', () => {
      return request(app.getHttpServer())
        .put('/environments/katla-utv/deployments/one-no-yet-created')
        .auth(accessToken, { type: 'bearer' })
        .send({
          memory_min: '32mb',
        })
        .expect(404);
    });

    it('rejects updates to undefined-or-non-writeable properties', async () => {
      await request(app.getHttpServer())
        .put('/environments/katla-utv/deployments/bff-gateway')
        .auth(accessToken, { type: 'bearer' })
        .send({
          made_up_today: 'not okay',
        })
        .expect(400);

      await request(app.getHttpServer())
        .put('/environments/katla-utv/deployments/bff-gateway')
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'cannot-be-changed',
          environment: 'is-immutable',
        })
        .expect(400);

      await request(app.getHttpServer())
        .put('/environments/katla-utv/deployments/bff-gateway')
        .auth(accessToken, { type: 'bearer' })
        .send({
          ocp_namespace: '',
        })
        .expect(400);
    });
  });

  describe('DELETE /environments/katla-utv/deployments/:name', () => {
    it('deletes specific deployment by name', () => {
      return request(app.getHttpServer())
        .delete('/environments/katla-utv/deployments/bff-gateway')
        .auth(accessToken, { type: 'bearer' })
        .expect(200)
        .expect({
          environment: 'katla-utv',
          ocp_namespace: 'front',
          name: 'bff-gateway',
          is_gateway: true,
          memory_min: null,
          memory_max: null,
          cpu_min: '50m',
          cpu_max: '400m',
          replicas_target: 2,
          replicas_current: null,
          spring_profiles_active: null,
          image_tag: null,
          build_timestamp: null,
        });
    });

    it('returns a 404 error for incorrect /environments/katla-utv/deployments/:name', () => {
      return request(app.getHttpServer())
        .delete('/environments/katla-utv/deployments/one-yet-to-be-created')
        .auth(accessToken, { type: 'bearer' })
        .expect(404);
    });
  });
});
