import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthenticatedGuard
  extends AuthGuard('jwt')
  implements CanActivate {
  private readonly logger = new Logger(AuthenticatedGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    const request = context.switchToHttp().getRequest();
    this.logger.debug(`canActivate: request.url=${request.url}`);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    if (request.isAuthenticated()) {
      return request.isAuthenticated();
    } else {
      return super.canActivate(context);
    }
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    this.logger.log(
      `handleRequest ('jwt' auth guard): err=${JSON.stringify(
        err,
      )}, user=${JSON.stringify(user)}, info=${JSON.stringify(info)}`,
    );
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
