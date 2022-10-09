import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const Public = this.reflector.get<boolean>('Public', context.getHandler());
    const req = context.switchToHttp().getRequest();
    if (Public && !req.headers['authorization']) {
      return true;
    }
    return super.canActivate(context);
  }
}
