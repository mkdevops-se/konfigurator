import {
  ExecutionContext,
  INestApplication,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MockBuildInfoModule } from '../src/mock-build-info/mock-build-info.module';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';

describe('MockBuildInfoController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, MockBuildInfoModule],
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

  it('GET /mock-api/protected', () => {
    return request(app.getHttpServer())
      .get('/mock-api/protected')
      .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...-ptvwvFcab_K5B4q1EEpTQc', {
        type: 'bearer',
      })
      .expect(200)
      .expect('a secret string');
  });

  describe('POST /mock-api/surgrisen/byggInfo', () => {
    it('creates mock build-info with only required properties', async () => {
      const mockServiceName = 'surgrisen';
      const mockBuildInfo = {
        IMAGE_TAG: '0.3.2_feature.THEFARM.321.dev1',
        BUILD_TIMESTAMP: '2019-12-14T09:53:25-0400',
        COMMIT_LINK: 'https://github.com/mkdevops-se/konfigurator/commit/0c23d',
      };
      await request(app.getHttpServer())
        .post(`/mock-api/${mockServiceName}/byggInfo`)
        .send(mockBuildInfo)
        .expect(201)
        .expect({
          ...mockBuildInfo,
        });
    });

    it('creates mock build-info with all optional properties', async () => {
      const mockServiceName = 'surgrisen';
      const mockBuildInfo = {
        IMAGE_TAG: '0.3.2_feature.THEFARM.456.dev3',
        BUILD_TIMESTAMP: '2019-12-19T11:30:15+0100',
        COMMIT_LINK: 'https://github.com/mkdevops-se/konfigurator/commit/23d21',
        BUILD_TYPE: null,
        SPRING_PROFILES_ACTIVE: 'prod',
        ARTIFACTORY_PATH: null,
        JENKINS_HOST: 'classified',
        OPERATOR_ID: null,
      };
      await request(app.getHttpServer())
        .post(`/mock-api/${mockServiceName}/byggInfo`)
        .send(mockBuildInfo)
        .expect(201)
        .expect({
          ...mockBuildInfo,
        });
    });

    it('rejects invalid build-info', async () => {
      const badMockBuild = {
        IMAGE_TAG: '0.3.2_feature.THEFARM.321.dev3',
        BUILD_TIMESTAMP: '2021-01-04T21:24:30+0100',
        COMMIT_LINK: 'https://github.com/mkdevops-se/konfigurator/commit/47b56',
        SOME_NEW_PROPERTY: 'reject me', // Illegally undefined.
      };
      await request(app.getHttpServer())
        .post(`/mock-api/surgrisen/byggInfo`)
        .send(badMockBuild)
        .expect(400);
    });
  });

  describe('GET /mock-api/surgrisen/byggInfo', () => {
    it('returns the mock /mock-api/surgrisen/byggInfo', async () => {
      const mockServiceName = 'surgrisen';

      await request(app.getHttpServer())
        .get('/mock-api/surgrisen/byggInfo')
        .expect(200)
        .expect({
          IMAGE_TAG: '0.3.2_feature.THEFARM.321.dev1',
          BUILD_TIMESTAMP: '2019-12-14T09:53:25-0400',
          COMMIT_LINK:
            'https://github.com/mkdevops-se/konfigurator/commit/0c23d',
        });

      await request(app.getHttpServer())
        .get('/mock-api/surgrisen/byggInfo')
        .expect(200)
        .expect({
          IMAGE_TAG: '0.3.2_feature.THEFARM.456.dev3',
          BUILD_TIMESTAMP: '2019-12-19T11:30:15+0100',
          COMMIT_LINK:
            'https://github.com/mkdevops-se/konfigurator/commit/23d21',
          BUILD_TYPE: null,
          SPRING_PROFILES_ACTIVE: 'prod',
          ARTIFACTORY_PATH: null,
          JENKINS_HOST: 'classified',
          OPERATOR_ID: null,
        });
    });

    it('returns a 404 error for /mock-api/service-unknown/byggInfo', () => {
      return request(app.getHttpServer())
        .get('/mock-api/service-unknown/byggInfo')
        .expect(404);
    });
  });

  describe('DELETE /mock-api/surgrisen/byggInfo', () => {
    it('deletes mock build info for service', async () => {
      await request(app.getHttpServer())
        .delete('/mock-api/surgrisen/byggInfo')
        .expect(200)
        .expect({
          IMAGE_TAG: '0.3.2_feature.THEFARM.456.dev3',
          BUILD_TIMESTAMP: '2019-12-19T11:30:15+0100',
          COMMIT_LINK:
            'https://github.com/mkdevops-se/konfigurator/commit/23d21',
          BUILD_TYPE: null,
          SPRING_PROFILES_ACTIVE: 'prod',
          ARTIFACTORY_PATH: null,
          JENKINS_HOST: 'classified',
          OPERATOR_ID: null,
        });

      await request(app.getHttpServer())
        .delete('/mock-api/surgrisen/byggInfo')
        .expect(200)
        .expect({
          IMAGE_TAG: '0.3.2_feature.THEFARM.321.dev1',
          BUILD_TIMESTAMP: '2019-12-14T09:53:25-0400',
          COMMIT_LINK:
            'https://github.com/mkdevops-se/konfigurator/commit/0c23d',
        });
    });

    it('returns a 404 error for already deleted /mock-api/surgrisen/byggInfo', () => {
      return request(app.getHttpServer())
        .delete('/mock-api/surgrisen/byggInfo')
        .expect(404);
    });
  });
});
