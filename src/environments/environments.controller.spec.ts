import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentsController } from './environments.controller';
import { EnvironmentsService } from './environments.service';

describe('EnvironmentsController', () => {
  let controller: EnvironmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnvironmentsController],
      providers: [EnvironmentsService],
    }).compile();

    controller = module.get<EnvironmentsController>(EnvironmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /environments', () => {
    it('should return the newly created environment', async () => {
      const newEnvironment = {
        name: 'app-backend-utv',
        ocp_tenant_domain: 'test.ocp.github.org',
        ocp_namespace_front: 'front',
        ocp_namespace_backend: 'backend',
        ocp_namespace_restricted: 'restricted',
        default_spring_profiles: 'test',
      };
      expect(await controller.create(newEnvironment)).toBe(newEnvironment);
    });
  });

  describe('GET /environments/:id', () => {
    it('should return "here are the environment with ID ..."', () => {
      expect(controller.get('foo')).toBe(
        'here are the environment with ID foo',
      );
    });
  });

  describe('GET /environments', () => {
    it('should return an empty list of all environments', async () => {
      expect(await controller.getAll()).toStrictEqual([]);
    });
  });

  describe('PUT /environments/:id', () => {
    it('should return "here is the updated environment with ID ..."', () => {
      expect(
        controller.update('foo', {
          default_spring_profiles: 'test',
        }),
      ).toBe('here is the updated environment with ID foo');
    });
  });

  describe('DELETE /environments/:id', () => {
    it('should return "environment with ID ... deleted"', () => {
      expect(controller.remove('foo')).toBe('environment with ID foo deleted');
    });
  });
});
