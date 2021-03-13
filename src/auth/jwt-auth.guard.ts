import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    this.logger.log(
      `JwtAuthGuard.canActivate: context.args[0].url=${
        context.getArgs()[0].url
      }`,
    );
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    this.logger.log(
      `JwtAuthGuard.handleRequest: err=${JSON.stringify(
        err,
      )}, user=${JSON.stringify(user)}, info=${JSON.stringify(info)}`,
    );
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
