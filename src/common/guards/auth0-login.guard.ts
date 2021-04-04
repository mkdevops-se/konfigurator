import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class Auth0LoginGuard extends AuthGuard('auth0') {
  private readonly logger = new Logger(Auth0LoginGuard.name);

  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    this.logger.debug(`canActivate: request.url=${request.url}`);
    await super.logIn(request);
    return result;
  }
}
