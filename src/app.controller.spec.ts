import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppModule } from './app.module';
import { BuildsModule } from './builds/builds.module';
import { DeploymentsModule } from './deployments/deployments.module';
import { EnvironmentsModule } from './environments/environments.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule, BuildsModule, DeploymentsModule, EnvironmentsModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('GET /', () => {
    it('should redirect to /overview page', async () => {
      expect(await appController.root()).toMatchObject({ url: '/overview' });
    });
  });

  describe('GET /overview', () => {
    it('should return "konfigurator" overview page', async () => {
      expect(await appController.getOverview()).toMatchObject({
        title: 'konfigurator',
        message: `Aktuell status: Miljöinformation visas baserat på senast inläst innehåll i databasen, klicka på "↻"-knapparna för att uppdatera.`,
        SERVER_STARTUP_TIMESTAMP: process.env.SERVER_STARTUP_TIMESTAMP,
        environments: [],
      });
    });
  });

  describe('GET /hello', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
