import { AuthExceptionFilter } from './auth-exceptions.filter';

describe('AuthExceptionFilter', () => {
  it('should be defined', () => {
    expect(new AuthExceptionFilter()).toBeDefined();
  });
});
