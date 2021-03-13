import * as request from 'supertest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from '../src/app.module';
import { BuildsModule } from '../src/builds/builds.module';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';

describe('BuildsController (e2e)', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, BuildsModule],
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

  it('GET /builds/protected', () => {
    return request(app.getHttpServer())
      .get('/builds/protected')
      .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...-ptvwvFcab_K5B4q1EEpTQc', {
        type: 'bearer',
      })
      .expect(200)
      .expect('a secret string');
  });

  describe('POST /builds/surgrisen/0.3.2_feature.THEFARM.321.dev1', () => {
    it('creates a valid build', () => {
      const newBuildImageName = 'surgrisen';
      const newBuildProperties = {
        image_tag: '0.3.2_feature.THEFARM.321.dev1',
        build_timestamp: '2019-12-14T09:53:25-0400',
        commit_link: 'https://github.com/mkdevops-se/konfigurator/commit/0c23d',
        build_type: 'develop',
      };
      return request(app.getHttpServer())
        .post(`/builds/${newBuildImageName}`)
        .send(newBuildProperties)
        .expect(201)
        .expect({
          image_name: newBuildImageName,
          ...newBuildProperties,
          spring_profiles_active: null,
          artifactory_path: null,
          jenkins_host: null,
          operator_id: null,
        });
    });

    it('rejects an invalid deployment', async () => {
      const existingBuildImageName = 'surgrisen';
      const duplicateBuildProperties = {
        image_tag: '0.3.2_feature.THEFARM.321.dev1',
        build_timestamp: '2021-01-04T21:24:30+0100',
        commit_link: 'https://github.com/mkdevops-se/konfigurator/commit/47b56',
      };
      await request(app.getHttpServer())
        .post(`/builds/${existingBuildImageName}`)
        .send(duplicateBuildProperties)
        .expect(409);

      const badBuild1 = {
        image_tag: '0.3.2_feature.THEFARM.321.dev2',
        build_timestamp: '2021-01-04T21:24:30+0100',
        commit_link: '', // Illegally empty.
      };
      await request(app.getHttpServer())
        .post(`/builds/${existingBuildImageName}`)
        .send(badBuild1)
        .expect(400);

      const badBuild2 = {
        image_tag: '0.3.2_feature.THEFARM.321.dev3',
        build_timestamp: '2021-01-04T21:24:30+0100',
        commit_link: 'https://github.com/mkdevops-se/konfigurator/commit/47b56',
        someNewProperty: 'reject me', // Illegally undefined.
      };
      await request(app.getHttpServer())
        .post(`/builds/${existingBuildImageName}`)
        .send(badBuild2)
        .expect(400);
    });
  });

  describe('GET /builds/surgrisen', () => {
    it('returns a specific /builds/surgrisen/:image_tag', () => {
      return request(app.getHttpServer())
        .get('/builds/surgrisen/0.3.2_feature.THEFARM.321.dev1')
        .expect(200)
        .expect({
          image_name: 'surgrisen',
          image_tag: '0.3.2_feature.THEFARM.321.dev1',
          build_timestamp: '2019-12-14T09:53:25-0400',
          commit_link:
            'https://github.com/mkdevops-se/konfigurator/commit/0c23d',
          build_type: 'develop',
          spring_profiles_active: null,
          artifactory_path: null,
          jenkins_host: null,
          operator_id: null,
        });
    });

    it('returns a 404 error for incorrect /builds/surgrisen/:image_tag', () => {
      return request(app.getHttpServer())
        .get('/builds/surgrisen/one-yet-to-be-created')
        .expect(404);
    });

    it('returns all /builds/surgrisen', () => {
      return request(app.getHttpServer())
        .get('/builds/surgrisen')
        .expect(200)
        .expect([
          {
            image_name: 'surgrisen',
            image_tag: '0.3.2_feature.THEFARM.321.dev1',
            build_timestamp: '2019-12-14T09:53:25-0400',
            commit_link:
              'https://github.com/mkdevops-se/konfigurator/commit/0c23d',
            build_type: 'develop',
            spring_profiles_active: null,
            artifactory_path: null,
            jenkins_host: null,
            operator_id: null,
          },
        ]);
    });
  });

  describe('PUT /builds/surgrisen/0.3.2_feature.THEFARM.321.dev1', () => {
    it('updates defined-and-writeable properties of an entity', () => {
      return request(app.getHttpServer())
        .put('/builds/surgrisen/0.3.2_feature.THEFARM.321.dev1')
        .send({
          build_timestamp: '2021-01-05T09:00:00+0100',
          spring_profiles_active: 'test,test-acc',
          artifactory_path: 'https://artifactory.utv.mkdevops.se/katla',
          jenkins_host: 'https://jenkins-katla-cd.ocp.test.mkdevops.se',
          operator_id: 'mblomdahl',
        })
        .expect(200)
        .expect({
          image_name: 'surgrisen',
          image_tag: '0.3.2_feature.THEFARM.321.dev1',
          build_timestamp: '2021-01-05T09:00:00+0100',
          commit_link:
            'https://github.com/mkdevops-se/konfigurator/commit/0c23d',
          build_type: 'develop',
          spring_profiles_active: 'test,test-acc',
          artifactory_path: 'https://artifactory.utv.mkdevops.se/katla',
          jenkins_host: 'https://jenkins-katla-cd.ocp.test.mkdevops.se',
          operator_id: 'mblomdahl',
        });
    });

    it('returns a 404 error for incorrect /builds/:image_name/:image_tag', () => {
      return request(app.getHttpServer())
        .put('/builds/surgrisen/tag-that-does-not-exist')
        .send({
          spring_profiles_active: 'test',
        })
        .expect(404);
    });

    it('rejects updates to undefined-or-non-writeable properties', async () => {
      await request(app.getHttpServer())
        .put('/builds/surgrisen/0.3.2_feature.THEFARM.321.dev1')
        .send({
          made_up_today: 'not okay',
        })
        .expect(400);

      await request(app.getHttpServer())
        .put('/builds/surgrisen/0.3.2_feature.THEFARM.321.dev1')
        .send({
          image_name: 'cannot-be-changed',
        })
        .expect(400);

      await request(app.getHttpServer())
        .put('/builds/surgrisen/0.3.2_feature.THEFARM.321.dev1')
        .send({
          image_tag: 'cannot-be-changed-either',
        })
        .expect(400);
    });
  });

  describe('DELETE /builds/surgrisen/0.3.2_feature.THEFARM.321.dev1', () => {
    it('deletes specific deployment by name', () => {
      return request(app.getHttpServer())
        .delete('/builds/surgrisen/0.3.2_feature.THEFARM.321.dev1')
        .expect(200)
        .expect({
          image_name: 'surgrisen',
          image_tag: '0.3.2_feature.THEFARM.321.dev1',
          build_timestamp: '2021-01-05T09:00:00+0100',
          commit_link:
            'https://github.com/mkdevops-se/konfigurator/commit/0c23d',
          build_type: 'develop',
          spring_profiles_active: 'test,test-acc',
          artifactory_path: 'https://artifactory.utv.mkdevops.se/katla',
          jenkins_host: 'https://jenkins-katla-cd.ocp.test.mkdevops.se',
          operator_id: 'mblomdahl',
        });
    });

    it('returns a 404 error for incorrect /builds/:image_name/:image_tag', () => {
      return request(app.getHttpServer())
        .delete('/builds/fake-image/one-yet-to-be-created')
        .expect(404);
    });
  });

  describe('GET /builds', () => {
    it('returns a HTML page with a builds overview', () => {
      return request(app.getHttpServer())
        .get('/builds')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .then((response) => {
          expect(response.text).toContain('<title>builds</title>');
          expect(response.text).toContain(
            '<h1>Kända mikrotjänst-byggen från OpenShift</h1>',
          );
        });
    });
  });
});
