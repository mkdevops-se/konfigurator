import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentsController } from './environments.controller';
import { Param } from '@nestjs/common';

describe('EnvironmentsController', () => {
  let controller: EnvironmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnvironmentsController],
    }).compile();

    controller = module.get<EnvironmentsController>(EnvironmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /environments', () => {
    it('should return "environment added"', () => {
      expect(controller.create()).toBe('environment added');
    });
  });

  describe('GET /environments/:id', () => {
    it('should return "here are the environment with ID ..."', () => {
      let param = Param();
      param['id'] = 'foo';
      expect(controller.get(param)).toBe(
        'here are the environment with ID foo',
      );
    });
  });

  describe('GET /environments', () => {
    it('should return "here are all environments"', () => {
      expect(controller.getAll()).toBe('here are all environments');
    });
  });

  describe('PUT /environments/:id', () => {
    it('should return "here is the updated environment with ID ..."', () => {
      let param = Param();
      param['id'] = 'foo';
      expect(controller.update(param)).toBe(
        'here is the updated environment with ID foo',
      );
    });
  });

  describe('DELETE /environments/:id', () => {
    it('should return "environment with ID ... deleted"', () => {
      let param = Param();
      param['id'] = 'foo';
      expect(controller.remove(param)).toBe('environment with ID foo deleted');
    });
  });
});
